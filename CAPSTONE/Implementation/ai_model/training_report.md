# Device Care AI Model - Training & Evaluation Report

## Model Overview
- **Model Name:** DeviceCare Mobile Resource Intelligence Neural Network
- **Architecture:** Multi-Head Deep Neural Network (Shared Latent Space + Dual Head)
- **Framework:** TensorFlow / Keras (Exported to JSON for on-device zero-latency execution)
- **Input Features (8):**
  1. `cpu_pct`: Real-time CPU Utilization (0 - 100%)
  2. `ram_pct`: RAM / Memory Allocation (0 - 100%)
  3. `battery_temp_c`: Battery Core Temperature (20 - 55 °C)
  4. `screen_on_time_hrs`: Daily Screen Active Hours (0 - 14 hrs)
  5. `bg_apps_count`: Active Background Processes (0 - 45)
  6. `storage_used_pct`: Internal Storage Fullness (0 - 100%)
  7. `battery_cycles`: Hardware Charge Cycles Count (0 - 1200)
  8. `network_activity_mb`: Live Network Bandwidth Usage (MB/s)

## Evaluation Results
- **Test Set Size:** 1500 samples
- **Health State Classification Accuracy:** **90.53%**
- **Drain Rate & Score Regression MAE:** **1.456**
- **Output Classes:**
  - `OPTIMAL` (Normal low-energy operations, low heat)
  - `MODERATE_DRAIN` (Noticeable active drain, background tasks)
  - `THERMAL_THROTTLE` (Severe thermal escalation >40°C, throttled CPU)
  - `CRITICAL_CONGESTION` (Severe RAM overload, heavy cache fragmentation)

## Deployment Mechanism
The model parameters (weights, biases, min-max normalizers) are exported to `ai_model_weights.json` and bundled inside the mobile client via an optimized matrix multiplier engine. This guarantees:
1. **100% On-Device Execution:** No cloud server needed, works offline.
2. **Zero Latency:** Inference completes in < 2ms directly on any smartphone CPU.
3. **Privacy-Preserving:** No telemetry data leaves the user's phone.
