# Phase 3 — Design Tokens, Global CSS, and Layout Foundation

**Recommended Cursor model:** Claude Sonnet / Auto.

## Goal
Build the visual foundation so the project matches the Figma screenshots before adding complex interactions.

## Context from screenshots
The design is clean, compact, and rounded. It uses:
- a light icy-blue builder/review background
- white product cards
- purple selected borders and CTA buttons
- dark navy/black text
- muted gray section labels
- small uppercase step labels
- compact product card spacing
- review panel with soft blue background
- rounded corners around major containers

Desktop screenshot:
- two-column layout
- left builder column
- right review panel
- review panel is narrower and visually aligned with the top of the builder

Tablet/wider stacked screenshot:
- builder full width
- review panel appears below and becomes more horizontal

Mobile screenshot:
- single narrow column
- accordion headers are full width
- review section sits below the steps
- spacing remains compact and usable

## Exact work
1. Create global CSS in `src/styles/global.css`.
2. Import it once in `src/main.tsx`.
3. Create design tokens as CSS variables under `:root`.

## CSS variables to include
Use these values as a starting point and fine-tune after comparing to screenshots:

```css
:root {
  --color-page: #ffffff;
  --color-panel: #eef5ff;
  --color-panel-strong: #e8f1ff;
  --color-card: #ffffff;
  --color-text: #151827;
  --color-muted: #677085;
  --color-soft: #a8b0c2;
  --color-border: #cbd4e4;
  --color-border-soft: #dce5f3;
  --color-primary: #5437e8;
  --color-primary-hover: #4226d4;
  --color-success: #00a870;
  --color-danger: #e23d35;
  --radius-panel: 10px;
  --radius-card: 8px;
  --shadow-soft: 0 12px 30px rgba(20, 24, 39, 0.06);
  --font-main: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

## Layout requirements
1. Update `App.tsx` to render the main shell only:
   - root page wrapper
   - centered app container
   - builder column placeholder
   - review panel placeholder
2. Create `src/components/AppShell.tsx`.
3. The desktop layout should be:
   - max-width around `1180px`
   - left column flexible
   - right column around `360px`
   - gap around `24px`
4. At medium widths, stack review below the builder.
5. At phone widths:
   - page padding around `16px`
   - full-width panels
   - no horizontal scrolling

## Typography rules
- Use the global font stack only.
- Titles should be bold and rounded-feeling.
- Step label should be uppercase, small, letter-spaced.
- Body text should stay compact.
- Do not use overly large text.

## Accessibility base
- Set `box-sizing: border-box`.
- Add visible focus styles.
- Respect reduced motion.
- Buttons must use actual `<button>` elements.

## Acceptance checklist
- The app shell visually resembles the Figma composition.
- Desktop has two columns.
- Smaller screens stack cleanly.
- No product card/review logic yet.
- No horizontal overflow.
- Build passes.
