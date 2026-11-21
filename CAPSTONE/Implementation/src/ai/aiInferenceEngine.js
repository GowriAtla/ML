import modelWeights from './modelWeights.json';

/**
 * On-Device AI Neural Network Inference Engine
 * Runs zero-latency forward pass on mobile device using pre-trained weights
 */

// Activation functions
function relu(arr) {
  return arr.map(x => Math.max(0, x));
}

function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((acc, val) => acc + val, 0);
  return exps.map(x => x / sum);
}

// Matrix vector multiplication: y = x @ W + b
function dense(input, weights, bias, activation = null) {
  // input: [N], weights: [N, M], bias: [M]
  const outDim = bias.length;
  const inDim = input.length;
  const output = new Array(outDim).fill(0);

  for (let j = 0; j < outDim; j++) {
    let sum = bias[j];
    for (let i = 0; i < inDim; i++) {
      sum += input[i] * weights[i][j];
    }
    output[j] = sum;
  }

  if (activation === 'relu') return relu(output);
  if (activation === 'softmax') return softmax(output);
  return output;
}

/**
 * Runs inference on raw telemetry inputs
 * @param {Object} telemetry - raw device metrics
 * @returns {Object} AI Prediction results
 */
export function predictDeviceHealth(telemetry) {
  const {
    cpu = 25,
    ram = 45,
    temp = 32,
    screenTime = 3.5,
    bgApps = 6,
    storage = 60,
    cycles = 250,
    network = 2.5
  } = telemetry;

  const rawFeatures = [cpu, ram, temp, screenTime, bgApps, storage, cycles, network];

  const { scaler, weights, model_metadata } = modelWeights;

  // 1. Min-Max Normalization
  const normFeatures = rawFeatures.map((val, idx) => {
    const min = scaler.x_min[idx];
    const range = scaler.x_range[idx];
    return (val - min) / range;
  });

  // 2. Layer 1: Dense 64 (ReLU)
  const h1 = dense(normFeatures, weights.w1, weights.b1, 'relu');

  // 3. Layer 2: Dense 32 (ReLU)
  const h2 = dense(h1, weights.w2, weights.b2, 'relu');

  // 4. Head 1: Health Class Softmax (4 classes)
  const classProbs = dense(h2, weights.w_class, weights.b_class, 'softmax');

  // 5. Head 2: Metrics Linear (drain_rate, health_score)
  const regMetrics = dense(h2, weights.w_metrics, weights.b_metrics);

  const predictedDrainRate = Math.max(1.2, Math.min(38.0, regMetrics[0]));
  const predictedHealthScore = Math.max(15, Math.min(100, Math.round(regMetrics[1])));

  const classNames = model_metadata.classes; // ["OPTIMAL", "MODERATE_DRAIN", "THERMAL_THROTTLE", "CRITICAL_CONGESTION"]
  let maxIdx = 0;
  for (let i = 1; i < classProbs.length; i++) {
    if (classProbs[i] > classProbs[maxIdx]) maxIdx = i;
  }

  const primaryStatus = classNames[maxIdx];
  const confidence = Math.round(classProbs[maxIdx] * 100);

  // Remaining battery life estimate in hours based on current battery % and predicted drain rate
  const batteryLevel = telemetry.batteryLevel ?? 75;
  const remainingHours = (batteryLevel / Math.max(predictedDrainRate, 1.5));
  const remHoursInt = Math.floor(remainingHours);
  const remMinutesInt = Math.round((remainingHours - remHoursInt) * 60);

  // Diagnostic insights and primary bottlenecks
  const bottlenecks = [];
  if (temp >= 40.0) {
    bottlenecks.push({
      type: 'thermal',
      severity: temp > 44 ? 'critical' : 'warning',
      title: 'Elevated Core Temperature',
      detail: `Battery core is operating at ${temp.toFixed(1)}°C. High temperature accelerates cell wear and triggers CPU throttling.`
    });
  }
  if (ram >= 80) {
    bottlenecks.push({
      type: 'ram',
      severity: ram > 90 ? 'critical' : 'warning',
      title: 'High RAM Pressure',
      detail: `${ram.toFixed(0)}% RAM allocated. OS is aggressively paging memory, causing app reload lag.`
    });
  }
  if (cpu >= 75) {
    bottlenecks.push({
      type: 'cpu',
      severity: cpu > 90 ? 'critical' : 'warning',
      title: 'Heavy Processor Activity',
      detail: `CPU at ${cpu.toFixed(0)}% load. Active background cycles are increasing power consumption by ~${(cpu * 0.12).toFixed(1)}%/hr.`
    });
  }
  if (bgApps > 15) {
    bottlenecks.push({
      type: 'bgApps',
      severity: 'warning',
      title: 'High Background Process Count',
      detail: `${bgApps} background apps active. Several apps may be executing background keep-alive wake-locks.`
    });
  }
  if (storage >= 88) {
    bottlenecks.push({
      type: 'storage',
      severity: storage > 94 ? 'critical' : 'warning',
      title: 'Storage Fullness Warning',
      detail: `Internal storage is ${storage.toFixed(0)}% full. Flash controller write wear and TRIM operations can degrade performance.`
    });
  }

  // Prescriptive AI Recommendation
  let recommendation = "System running optimally. No optimization required at this time.";
  let actionCode = "NONE";

  if (primaryStatus === "THERMAL_THROTTLE") {
    recommendation = "Device is experiencing thermal buildup. Switch to Adaptive Power Saving and allow device to cool.";
    actionCode = "COOL_DOWN";
  } else if (primaryStatus === "CRITICAL_CONGESTION") {
    recommendation = "Memory and storage cache are severely congested. Perform a Deep Clean to free RAM and purge cached data.";
    actionCode = "DEEP_CLEAN";
  } else if (primaryStatus === "MODERATE_DRAIN") {
    recommendation = "Battery drain rate is above normal. Close unnecessary background tasks to preserve power.";
    actionCode = "BOOST_RAM";
  }

  return {
    primaryStatus,
    confidence,
    predictedDrainRate: Number(predictedDrainRate.toFixed(1)),
    predictedHealthScore,
    remainingTime: {
      hours: remHoursInt,
      minutes: remMinutesInt,
      formatted: `${remHoursInt}h ${remMinutesInt}m`
    },
    classProbabilities: {
      OPTIMAL: Math.round(classProbs[0] * 100),
      MODERATE_DRAIN: Math.round(classProbs[1] * 100),
      THERMAL_THROTTLE: Math.round(classProbs[2] * 100),
      CRITICAL_CONGESTION: Math.round(classProbs[3] * 100)
    },
    bottlenecks,
    recommendation,
    actionCode,
    metadata: model_metadata
  };
}
