# Phase 1 — Project Setup, Reference Audit, and Delivery Rules

**Recommended Cursor model:** Auto. If selecting manually, use Claude Sonnet / the strongest fast coding model available. Use Max Mode only if Cursor needs to inspect the whole repo at once.

## Goal
Set up the React prototype correctly in the current folder and create a clean project foundation without implementing the full UI yet.

## Context
This is a frontend take-home for a **React multi-step bundle builder**. The current folder is the repo root. There are reference folders already provided:

- `figma design/` contains screenshots exported from the Figma design.
- `task gallery/` contains 5 product images named by product title for the camera products.

Do **not** delete or rename those reference folders in this phase.

## Exact work
1. Inspect the current folder structure.
2. If a React app is not already present, create a Vite + React + TypeScript project in this same root folder.
   - Do not create a nested app folder.
   - Because the folder is not empty, manually create the Vite structure if needed instead of forcing a scaffold that may erase files.
3. Use minimal dependencies:
   - `react`
   - `react-dom`
   - `vite`
   - `typescript`
   - `@vitejs/plugin-react`
   - no UI component libraries
   - no Tailwind unless it already exists and is clearly configured
4. Create the base structure:

```txt
src/
  assets/
  components/
  data/
  hooks/
  styles/
  types/
  utils/
  App.tsx
  main.tsx
  vite-env.d.ts
public/
```

5. Add or verify:
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `index.html`
   - `src/main.tsx`
   - `src/App.tsx`
6. Add clean scripts:
   - `dev`
   - `build`
   - `preview`
7. Make the app render a temporary placeholder only:
   - title: `Bundle Builder`
   - subtitle: `Project setup complete`
8. Run:
   - `npm install`
   - `npm run build`

## Quality rules
- Do not implement product cards yet.
- Do not implement state logic yet.
- Do not hardcode UI markup for the final product grid yet.
- Do not add comments that mention AI, Cursor, generated code, or prompts.
- Keep code clean, typed, and simple.

## Acceptance checklist
- The project runs with `npm run dev`.
- The project builds with `npm run build`.
- The reference folders still exist.
- The app is a React + TypeScript app in the current root folder.
- No unnecessary dependencies were added.
- No final UI implementation was started too early.
