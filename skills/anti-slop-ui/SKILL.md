---
name: anti-slop-ui
description: Bans generic AI frontend clichés (purple-blue gradients, bloated bento grids, unnecessary drop shadows) and enforces sharp, high-contrast, minimal layouts.
category: ui-design
tags:
  - ui-design
  - frontend
  - anti-slop
  - design-system
  - tailwind
---

## Skill Purpose
Purges generic, fatiguing AI frontend design tropes and enforces human-crafted visual rhythm, three-tier canvas depth, architectural color palettes with zero blue tint, editorial typography pairings, and tactile micro-interactions.

## Trigger Conditions
Activate this skill whenever:
- User asks to build, refactor, or review a web UI, landing page, dashboard, or frontend component.
- User instructs to "remove AI slop", "make it look human-crafted", "clean up generic gradients", or "fix dashboard design".
- Generating React, Next.js, HTML/CSS, or Tailwind UI components.
- Reviewing PR diffs touching frontend design tokens, theme configurations, or styling.

## Execution Protocol

1. **Color Palette Sanitization**:
   - **Purge Neon & Gradient Slop**: Immediately replace purple/violet gradients (`from-purple-500 to-indigo-500`) and neon royal blues with monochrome solids or warm architectural tones.
   - **Enforce Light Mode 3-Tier Canvas**:
     - Tier 1: Outer backdrop `#e7ebf0` (cool soft slate).
     - Tier 2: Floating content shell `#f7f8fa` (`rounded-[28px]` to `rounded-[32px]`).
     - Tier 3: Elevated component cards `#ffffff` (soft hairline border `#f0f0ee`, subtle shadow `shadow-[0_2px_12px_rgba(0,0,0,0.03)]`).
   - **Enforce Dark Mode Zero-Blue Tint**:
     - Background `#141111` (warm obsidian charcoal, 0°–10° hue, never `#090d16` or `#0f172a`).
     - Card `#231E1E` with 1px technical border `#383030`.
   - **Desaturate Status Chips**: Use muted organic backgrounds (`bg-emerald-50 text-emerald-700`, `bg-blue-50 text-blue-700`, `bg-amber-50 text-amber-800`, `bg-red-50 text-red-700`).

2. **Typographic Hierarchy & Editorial Pairing**:
   - Pair **editorial serif** (`font-serif font-normal tracking-tight`) for major section and column headings with **surgical sans-serif** (`Plus Jakarta Sans` or neutral sans) for UI labels and data.
   - **Quarantine Monospace**: Confine `font-mono` strictly to authentic technical telemetry (latency measurements e.g. `14ms`, crypto hashes, network ports, code). Never apply monospace to paragraphs, button labels, or navigation tabs.

3. **Icon Quarantining**:
   - Ban generic AI clichés: `Sparkles` (`✨`), `Wand2` (`🪄`), `Bot` (smiling robot head), generic `Zap`.
   - Mandate precision engineering glyphs: `Workflow` (DAGs), `BrainCircuit` (state runtime), `Boxes` (modular nodes), `Cable`/`Terminal` (IPC), `Fingerprint` (zero-trust security).
   - Enclose icons in structured micro-containers (`rounded-xs` or `rounded-sm`, 10% accent background, 20% border stroke).

4. **Viewport & Scroll Ergonomics**:
   - Eliminate window-level double scrollbars: set the outer window viewport to `h-screen w-screen overflow-hidden`.
   - Anchor the monolithic dark sidebar (`#141416`) to `h-screen overflow-hidden flex flex-col justify-between`.
   - Confine vertical scrolling strictly to the inner content canvas (`flex-1 h-screen overflow-y-auto`).

5. **Visual Rhythm & Tactile Geometry**:
   - **Asymmetrical Card Rhythm**: In any grid of 4+ cards, introduce an **inverted active hero card** (`bg-[#151518] text-white ring-1 ring-white/10`) to break eye fatigue.
   - **Pill Geometry**: Use `rounded-full` for primary CTAs (`bg-black text-white px-5 py-2.5 rounded-full`) and search inputs.
   - **Tactile Click Depression**: Add `active:scale-95` on buttons and `active:scale-[0.99]` on cards.

## Constraints
- **NEVER** use purple/violet gradients or neon royal blue on background glows, card borders, or primary buttons.
- **NEVER** place pure `#ffffff` cards directly onto harsh clinical `#f3f4f6` without tier-2 shell depth.
- **NEVER** apply monospace typography to body paragraphs, navigation menus, or primary CTAs.
- **NEVER** use `Sparkles`, `Wand2`, or smiling robot icons to signify software capabilities.
- **NEVER** allow the browser window to generate a global vertical scrollbar that pulls the sidebar out of view.
- **NEVER** create uniform grids where every single card shares identical white backgrounds, padding, and elevation.

## Output Contract
Respond with the sanitized, human-crafted component code and an executive Anti-Slop Audit Checklist:

```tsx
// Component implementation with 3-tier canvas, editorial typography, and zero-blue palette
export function Component() {
  return (
    ...
  );
}
```

```markdown
### Anti-Slop Audit Passed
- [x] Zero-blue-tint or 3-tier canvas depth enforced
- [x] Editorial serif + surgical sans typography paired; monospace quarantined
- [x] AI cliché icons (Sparkles/Wands) replaced with precision engineering glyphs
- [x] Inverted card optical rhythm applied
- [x] Independent viewport dual-scroll guaranteed
- [x] Tactile active press states wired
```
