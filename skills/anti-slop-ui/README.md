# anti-slop-ui

> **Enforces human-crafted visual rhythm, 3-tier canvas depth, and editorial typography while purging generic AI design tropes.**

[![Category: UI Design](https://img.shields.io/badge/Category-UI--Design-blue.svg)](../../README.md)
[![Standard: Anthropic Agent Skills](https://img.shields.io/badge/Standard-Anthropic%20Agent%20Skills-7C3AED.svg)](https://github.com/anthropics)

---

## ⚡ The Problem: AI Slop

When prompted to build a frontend, AI coding agents default to the exact same fatigued clichés:
- Blinding light gray backgrounds with glowing purple/indigo gradient blur orbs.
- Neon gradient buttons (`from-purple-600 via-indigo-600 to-blue-600`).
- Gimmicky icons: `Sparkles` (`✨`), `Wand2` (`🪄`), and smiling robot heads (`Bot`).
- Monospace font abused across long body paragraphs.
- Bento grids with identical white cards and heavy, muddy drop shadows.

---

## 🛠️ The Fix: Anti-Slop Design System

`anti-slop-ui` forces the agent to adhere to senior design engineering standards:

| Design Dimension | 🛑 What Gets Banned | ✅ What Gets Enforced |
| :--- | :--- | :--- |
| **Canvas Depth** | Flat `#ffffff` cards on raw `#f3f4f6` | **3-Tier Depth:** Slate backdrop (`#e7ebf0`) $\to$ Milky shell (`#f7f8fa`) $\to$ Elevated white surfaces |
| **Dark Theme** | Blue-tinted navy (`#0f172a`, `#090d16`) | **Zero-Blue Obsidian:** Warm charcoal (`#141111`, `#231E1E`) with 1px border (`#383030`) |
| **Typography** | Monospace everywhere or plain Inter | **Editorial Hierarchy:** Editorial serif for titles paired with neutral sans for body. Monospace quarantined strictly to telemetry (`<14ms`, crypto hashes, ports) |
| **Iconography** | `Sparkles`, `Wand2`, generic `Zap` | **Precision Glyphs:** `Workflow`, `BrainCircuit`, `Fingerprint`, `Terminal` |
| **Visual Rhythm** | 4 identical white cards in a grid | **Asymmetrical Rhythm:** Invert at least 1 card (`#151518`) to establish a clear active focal point |
| **Controls** | Harsh rectangular gradient buttons | **Tactile Pills:** Solid matte black pills (`rounded-full`) with `active:scale-95` press physics |

---

## 📋 Before & After

```tsx
// BEFORE (AI Slop):
<button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl rounded-2xl flex items-center">
  <Sparkles className="animate-pulse" /> Supercharge with AI
</button>

// AFTER (Human-Crafted):
<button className="bg-black hover:bg-zinc-800 text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-2">
  <span>Deploy Node</span>
  <ArrowRight size={13} />
</button>
```

---

## 🚀 Quickstart

### Claude Code
```bash
cp -r skills/anti-slop-ui .claude/skills/
```

### Cursor
```bash
cp skills/anti-slop-ui/SKILL.md .cursor/rules/anti-slop-ui.mdc
```

### Antigravity
```bash
cp -r skills/anti-slop-ui ~/.gemini/config/skills/
```
