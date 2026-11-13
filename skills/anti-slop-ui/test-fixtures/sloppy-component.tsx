// SLOPPY COMPONENT (AI Slop Anti-Pattern Example)
// Typical LLM-generated template riddled with frontend clichés

import React from "react";
import { Sparkles, Wand2, Bot } from "lucide-react";

export function SloppyDashboard() {
  return (
    // ANTI-PATTERN: Harsh gray background + huge glowing purple blob
    <div className="min-h-screen bg-gray-100 p-8 relative overflow-hidden font-mono">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

      {/* ANTI-PATTERN: Generic title with Sparkles icon and hollow buzzwords */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <Sparkles className="text-purple-600 animate-pulse" />
            AI SUPERCHARGED DASHBOARD
          </h1>
          {/* ANTI-PATTERN: Monospace abused on long body text */}
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            UNLEASH THE SEAMLESS AUTONOMOUS MAGIC OF NEXT-GEN INTELLIGENCE
          </p>
        </div>

        {/* ANTI-PATTERN: Neon purple-blue gradient button with drop shadow */}
        <button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
          <Wand2 size={16} />
          GENERATE WITH AI
        </button>
      </div>

      {/* ANTI-PATTERN: 4 completely identical white cards with heavy shadows */}
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-3 py-1 rounded-full uppercase">
                ACTIVE AGENT
              </span>
              <Bot className="text-indigo-600" size={18} />
            </div>
            <h2 className="text-xl font-bold uppercase mt-4 text-gray-800">
              TASK ORCHESTRATOR #{i}
            </h2>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">
              RUNNING CONTINUOUS INFERENCE WITH REALTIME KNOWLEDGE SYNERGY
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
