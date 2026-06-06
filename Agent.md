# Agent Rules

This document defines project conventions for component structure, page organization, and change documentation.

## Component structure

- All reusable UI components are stored under `src/components/`.
- Each component lives in its own folder:
  - `src/components/<component-name>/`
- Each component folder should contain:
  - `<component-name>.tsx` for React component logic
  - `<component-name>.css` for component-specific styles
  - `<component-name>.test.ts` for unit tests when tests are added
  - optional JSON configuration files for data-driven components, such as navigation or page menus
- Use data-driven components for repeated page patterns like character cards, kingdoms, and lore sections.

## Design and theme guidance

- The default visual theme should be a dark-mode fantasy aesthetic.
- Use deep charcoal backgrounds, muted amber or rust accent tones, and subtle textured borders.
- Keep the palette low-key and moody; avoid bright or neon colors.
- Prefer reusable UI pieces for repeated patterns: section headers, navigation bars, card layouts, content previews, and summary metadata panels.
- Metadata summary components should allow a title, optional image property, and a list of keyed properties displayed in a right-aligned panel.
- Article components should receive `name`, `metadata`, and `sections`, and render a title with sidebar metadata plus section cards.
- Navigation components may read configuration from a JSON file in the same folder and update root application state.

## Code style and stack requirements

- Use ES5-style logic in component code:
  - Prefer function declarations and plain objects
  - Keep code compatible with ES5 semantics wherever possible
- Keep the stack minimal and consistent with Vite + React:
  - `package.json` should provide basic scripts: `dev`, `build`, `preview`
  - Use `vite.config.js` with the React plugin
  - Keep styling scoped per component with `.css` files
  - Maintain a simple folder layout for source files

## Documentation and change tracking

- Every workspace change must be documented in `README.md`.
- Document new components, pages, or architecture updates as bullet points.
- Include a short changelog section in `README.md` for any new conventions or added files.

## Minimal requirements for this stack

- `src/main.jsx` and `src/App.jsx` remain the application entry point
- `src/index.css` may contain global baseline styles only
- Component-specific styles belong in their component folder
- Tests must live alongside component code and use the `.test.ts` convention
