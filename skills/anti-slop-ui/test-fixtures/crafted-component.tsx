// HUMAN-CRAFTED COMPONENT (Anti-AI-Slop Clean Implementation)
// Based on JK ProjectSphere 3-Tier Canvas & Graphvy Architectural Tokens

import React from "react";
import { Workflow, BrainCircuit, Fingerprint, ArrowRight } from "lucide-react";

export function CraftedDashboard() {
  return (
    // TIER 1: Canvas Backdrop (#e7ebf0) with independent viewport containment
    <div className="h-screen w-screen overflow-hidden flex bg-[#e7ebf0]">
      {/* MONOLITHIC SIDEBAR: Dark matte carbon (#141416) */}
      <aside className="w-56 h-screen bg-[#141416] p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 rounded-xs bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <BrainCircuit size={14} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white font-sans">
              SphereOps
            </span>
          </div>
          <nav className="space-y-1">
            <a
              href="#overview"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#222327] text-white text-xs font-medium"
            >
              <Workflow size={14} className="text-white/80" />
              Runtime Topology
            </a>
          </nav>
        </div>
        <div className="text-[11px] text-[#767782] font-mono">
          v2.4.1 • latency &lt;14ms
        </div>
      </aside>

      {/* TIER 2: Floating Shell Container (#f7f8fa) */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6">
        <div className="bg-[#f7f8fa] rounded-[32px] p-6 sm:p-8 border border-[#e2e5eb] shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          {/* HEADER: Editorial Serif Title paired with Surgical Sans subtitle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-900 tracking-tight">
                Execution Pipelines <span className="font-sans text-sm font-light text-zinc-400">(4)</span>
              </h1>
              <p className="text-xs text-zinc-500 font-sans mt-1">
                Deterministic DAG runtime with hardware-isolated RAM key zeroization.
              </p>
            </div>

            {/* Solid matte black pill button with tactile press feedback */}
            <button className="bg-black hover:bg-zinc-800 text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-2">
              <span>Deploy Node</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* TIER 3: Asymmetrical Card Grid with an Inverted Dark Hero Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* INVERTED ACTIVE HERO CARD: Breaks visual monotony */}
            <div className="bg-[#151518] p-5 rounded-2xl ring-1 ring-white/10 shadow-xl text-white relative flex flex-col justify-between active:scale-[0.99] transition-transform">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-xs">
                    ACTIVE • STAGE 2
                  </span>
                  <div className="w-5 h-5 rounded-xs bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <Fingerprint size={12} />
                  </div>
                </div>
                <h2 className="text-base font-semibold text-white tracking-tight font-sans">
                  Zero-Trust Memory Vault
                </h2>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  Ephemeral pgvector cosine search with volatile RAM purge.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-zinc-400">
                <span>pgcrypto RLS</span>
                <span className="text-white font-bold">&lt;0.2ms</span>
              </div>
            </div>

            {/* STANDARD SURFACE CARD 1: Soft border & fine shadow */}
            <div className="bg-white p-5 rounded-2xl border border-[#f0f0ee] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between active:scale-[0.99] transition-transform">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-xs">
                    ROUTED
                  </span>
                  <div className="w-5 h-5 rounded-xs bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                    <Workflow size={12} />
                  </div>
                </div>
                <h2 className="text-base font-semibold text-zinc-900 tracking-tight font-sans">
                  Reflect Loop Coordinator
                </h2>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  Cyclic state reflection bounded at deterministic cap N ≤ 5.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px] font-mono text-zinc-500">
                <span>LangGraph State</span>
                <span className="text-zinc-900 font-bold">14ms</span>
              </div>
            </div>

            {/* STANDARD SURFACE CARD 2: Soft border & fine shadow */}
            <div className="bg-white p-5 rounded-2xl border border-[#f0f0ee] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between active:scale-[0.99] transition-transform">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-xs">
                    STANDBY
                  </span>
                  <div className="w-5 h-5 rounded-xs bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                    <BrainCircuit size={12} />
                  </div>
                </div>
                <h2 className="text-base font-semibold text-zinc-900 tracking-tight font-sans">
                  PII Masking Gateway
                </h2>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  Real-time pattern redaction before external model egress.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px] font-mono text-zinc-500">
                <span>RFC 1918 Safe</span>
                <span className="text-zinc-900 font-bold">0.8s</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
