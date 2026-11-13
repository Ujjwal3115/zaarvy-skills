# Anti-AI Slop Design System & Visual Manifesto

A canonical engineering and design standard to purge generic, fatiguing AI frontend clichés and build human-crafted, architectural, and production-grade user interfaces.

---

## 1. The AI Slop Hall of Shame (What We Ban)

When modern LLMs are asked to generate a web page, component, or dashboard, they default to a homogenized, lazy set of tropes:

| AI Slop Trope | Why It Fails | The Human-Crafted Antidote |
| :--- | :--- | :--- |
| **Neon Purple/Blue Gradients** (`#3b82f6` to `#8b5cf6`) | Gives interfaces a cheap "crypto token wrapper" look and causes ocular fatigue. | **Monochrome & Warm Palettes**: Matte black/charcoal (`#151518` / `#1C1917`) or architectural stone with zero blue tint. |
| **Harsh Blinding Whites** (`#ffffff` on `#f3f4f6`) | Clinical, high-glare contrast that lacks optical depth. | **3-Tier Milky Architecture**: Backdrop (`#e7ebf0`) $\to$ Floating Shell (`#f7f8fa`) $\to$ Cards (`#ffffff`). |
| **Monospace Typography Abuse** | Slapping `font-mono uppercase` on body copy or hero titles to fake "developer credibility". | **Typographic Hierarchy**: Editorial serif for section headers (`font-serif font-normal`), surgical sans for UI, monospace strictly quarantined to technical telemetry. |
| **"AI Magic" Icons** (`✨ Sparkles`, `🪄 Wand2`, `🤖 Bot`) | Infantilizes tools and signals unpredictable hallucination. | **Precision Engineering Glyphs**: `Workflow` (DAGs), `BrainCircuit` (state runtime), `Boxes` (modular nodes), `Cable`/`Terminal` (IPC), `Fingerprint` (security). |
| **Uniform Lifeless Grids** | 8 identical white cards with identical padding and shadows creating visual numbness. | **Asymmetrical Rhythm**: Inverted active dark card (`#151518 text-white`) that anchors visual focus. |
| **Broken Viewport Ergonomics** | Entire window scrolls, double scrollbars on sidebar, modals that overflow. | **Dual-Scroll Architecture**: `h-screen overflow-hidden` fixed monolithic sidebar + independently scrolling main canvas (`overflow-y-auto`). |
| **Fake Glassmorphism** | Heavy `backdrop-blur` and washed-out translucent borders that look muddy. | **Crisp 1px Line Work**: 1px technical borders (`border-[#e2e5eb]` or `#383030`) and tactile button feedback (`active:scale-95`). |

---

## 2. Color Palettes: Two Authoritative Themes

### 2.1 Light Theme: Muted Milky Whites & Matte Charcoal (JK ProjectSphere Architecture)

```
┌──────────────────────────────────────────────────────────┐
│  Tier 1: Canvas Backdrop (#e7ebf0) — Soft Slate Outer    │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Tier 2: Floating Shell Container (#f7f8fa)         │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │ Tier 3: Component Surface Cards (#ffffff)       │ │  │
│  │ └────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- **Backdrop (Outer Shell)**: `#e7ebf0` (`bg-[#e7ebf0]`) — Soft cool slate.
- **Floating Shell (`rounded-[32px]`)**: `#f7f8fa` (`bg-[#f7f8fa]`) — Milky sanctuary housing all workspace content.
- **Standard Cards**: `#ffffff` (`bg-white border border-[#f0f0ee] shadow-[0_2px_12px_rgba(0,0,0,0.03)]`).
- **Inverted Hero Card**: `#151518` (`bg-[#151518] text-white ring-1 ring-white/10 shadow-xl`) — Anchors eye flow.
- **Monolithic Left Sidebar**: `#141416` (`bg-[#141416]`) — Non-reflective carbon charcoal pillar with `#222327` active tabs.

### 2.2 Dark Theme: Warm Obsidian & Architectural Stone (Graphvy Architecture — ZERO Blue Tint)

```css
/* Zero-Blue-Tint Obsidian Tokens */
--background: #141111;        /* Warm Obsidian Charcoal (0°-10° Hue, NOT #090d16) */
--bg-surface: #1B1717;        /* Deep Charcoal Sub-Surface */
--bg-card: #231E1E;           /* Signature Warm Card Charcoal */
--bg-card-hover: #2D2727;     /* Warm Charcoal Hover */
--border-grid: #383030;       /* 1px Technical Border Line */
--text-main: #FFFFFF;         /* Crisp White */
--text-secondary: #D6D3D1;    /* Off-White Stone */
--text-muted: #8C8282;        /* Warm Grey-Stone Metadata */
```

### 2.3 Status Chips (Desaturated Organic)
- **Completed / Optimal (Emerald)**: `bg-emerald-50 text-emerald-700 border-emerald-200` (Dark: `bg-emerald-950/40 text-emerald-400 border-emerald-800/60`)
- **Active / Review (Blue)**: `bg-blue-50 text-blue-700 border-blue-200` (Dark: `bg-sky-950/40 text-sky-400 border-sky-800/60`)
- **Warning / At Risk (Amber)**: `bg-amber-50 text-amber-800 border-amber-300` (Dark: `bg-amber-950/40 text-amber-400 border-amber-800/60`)
- **Critical / Blocker (Red)**: `bg-red-50 text-red-700 border-red-200` (Dark: `bg-rose-950/40 text-rose-400 border-rose-800/60`)
- **Rule**: Never use blinding saturated neon red (`#ff0000`) or canary yellow.

---

## 3. Typography: The Editorial Pairing Standard

```
Section & Column Headings    ───>  font-serif font-normal tracking-tight (e.g. "Planning (12)", "Architectural Vault")
UI Labels & Form Metadata   ───>  font-sans font-medium (e.g. "Plus Jakarta Sans", 400/500/600)
KPI Metrics Display          ───>  font-sans font-extrabold tracking-tight (e.g. "124", "99.9%")
Quarantined Telemetry Data   ───>  font-mono text-[11px] (Strictly for latencies, hashes, ports, and code)
```

### Typography Scale
- **Section Headers**: `font-serif text-xl sm:text-2xl font-normal text-zinc-900 tracking-tight`
- **Counter Micro-Titles**: `font-sans text-xs font-light text-zinc-400`
- **KPI Metrics**: `text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900`
- **Card Titles**: `text-sm sm:text-base font-semibold tracking-tight text-zinc-900`
- **Overline Badges**: `text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500`

---

## 4. Layout Geometry & Tactile Feedback

1. **Independent Dual Scroll**:
   ```tsx
   <div className="h-screen w-screen overflow-hidden flex bg-[#e7ebf0]">
     {/* Pinned non-scrolling monolithic sidebar */}
     <aside className="w-60 h-screen bg-[#141416] overflow-hidden flex flex-col shrink-0">...</aside>
     {/* Scrollable content canvas */}
     <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6">...</main>
   </div>
   ```
2. **Pill Geometry on Controls**:
   - Primary Action Button: `bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all`
   - Search & Filter Inputs: `rounded-full py-2.5 px-4 bg-white border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]`
3. **Tactile Click Feedback**:
   - Small controls / action arrows: `active:scale-95 transition-transform`
   - Cards: `active:scale-[0.99] transition-transform duration-150`
