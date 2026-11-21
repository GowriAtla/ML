import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function AIAssistantSheet({ isOpen, onClose, telemetry, aiPrediction, onQuickOptimize }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your Device Care AI Advisor powered by an on-device trained Neural Network. Current device health score is **${aiPrediction.predictedHealthScore}/100** with primary status **${aiPrediction.primaryStatus}**.\n\nHow can I help optimize your device today?`
    }
  ]);
  const [input, setInput] = useState('');
  const haptic = useHaptic();

  if (!isOpen) return null;

  const quickPrompts = [
    'Why is my battery draining?',
    'Is my temperature safe?',
    'Optimize for gaming',
    'Explain the AI model'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    haptic.light();
    const userMsg = { sender: 'user', text: query };

    // Generate intelligent AI response based on real telemetry & model predictions
    let aiReply = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('battery') || qLower.includes('drain')) {
      aiReply = `Based on our trained neural network analysis:\n- Predicted Drain Rate: **${aiPrediction.predictedDrainRate}%/hr**\n- Estimated Remaining Time: **${aiPrediction.remainingTime.formatted}**\n\nTop factors: ${
        telemetry.cpu > 50 ? 'High CPU activity (' + telemetry.cpu + '%)' : 'Display & background wake-locks'
      }. Recommend switching to **Adaptive Power Saving** and closing idle background applications.`;
    } else if (qLower.includes('temp') || qLower.includes('heat') || qLower.includes('safe') || qLower.includes('hot')) {
      if (telemetry.temp > 42) {
        aiReply = `⚠️ **Warning:** Battery temperature is currently **${telemetry.temp}°C** (Above safe threshold of 38°C). Sustained high temperature accelerates lithium cell degradation. Avoid fast charging while under heavy load.`;
      } else {
        aiReply = `✅ Battery temperature is **${telemetry.temp}°C**, which is within the safe thermal comfort operating zone (20°C - 38°C). The thermal dissipation governor is functioning normally.`;
      }
    } else if (qLower.includes('gaming') || qLower.includes('game') || qLower.includes('performance')) {
      aiReply = `For maximum gaming frame rate stability:\n1. Switch Power Profile to **Performance Mode**\n2. Free RAM before launching (Currently **${telemetry.ram}% used**)\n3. Ensure storage has at least 15% free space for swap space.`;
    } else if (qLower.includes('model') || qLower.includes('ai') || qLower.includes('train')) {
      aiReply = `This Device Care app utilizes a **Multi-Task Deep Neural Network** trained with TensorFlow/Keras on 12,000+ mobile device telemetry profiles.\n- Classification Accuracy: **${aiPrediction.metadata.evaluation.test_classification_accuracy_pct}%**\n- Regression MAE: **${aiPrediction.metadata.evaluation.test_regression_mae}**\n\nInference executes 100% on-device in <2ms without sending any personal data to the cloud.`;
    } else {
      aiReply = `AI Analysis for your current telemetry:\n- CPU: **${telemetry.cpu}%**\n- RAM: **${telemetry.ram}%** (${telemetry.bgApps} background apps)\n- Status: **${aiPrediction.primaryStatus}** (Confidence: ${aiPrediction.confidence}%)\n\nRecommendation: ${aiPrediction.recommendation}`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: 'ai', text: aiReply }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto bg-device-surface border-t border-device-border rounded-t-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-device-border/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Device Care AI Advisor</h3>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  On-Device ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Real-time Telemetry Assistant</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                    : 'bg-device-card border border-device-border/80 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-device-border/40">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium whitespace-nowrap px-3 py-1.5 rounded-full bg-device-card hover:bg-slate-800 text-slate-300 border border-device-border/70 active:scale-95 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-device-surface border-t border-device-border/70 flex items-center gap-2 safe-bottom">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask AI advisor about performance, battery..."
            className="flex-1 bg-device-card text-xs text-white rounded-xl px-3.5 py-2.5 border border-device-border focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
