# Mercia Wiki

This repository is a Vite + React application with a minimal component architecture.

## Project conventions

- Reusable UI components are stored under `src/components/<component-name>/`.
- Page-level components are stored under `src/pages/<page-name>/`.
- Each component folder includes:
  - `<component-name>.tsx`
  - `<component-name>.css`
  - `<component-name>.test.ts`
  - optional `.json` configuration files for data-driven navigation and layout
- Component code is written with ES5-friendly logic and avoids unnecessary modern syntax.
- Dark fantasy styling is encouraged for global theme and reusable page sections.

## Project files

- `package.json` contains scripts for `dev`, `build`, and `preview`.
- `vite.config.js` configures Vite with the React plugin.
- `index.html` is the single page entry point.
- `src/main.jsx` bootstraps the React app.
- `src/App.jsx` is the root application component.
- `src/index.css` provides global styles.
- `src/components/LateralBar/` holds the new lateral navigation component and JSON config.

## Changelog

- Initial setup: created Vite + React scaffold and project conventions.
- Added `Agent.md` to define component structure, page rules, ES5 logic, and README documentation requirements.
- Added `src/components/LateralBar/` with a collapsible lateral navigation bar driven by `lateral-bar-config.json`.
- Added `src/components/SectionBox/` with a reusable section panel that converts `[[Name]]` tokens into anchor links.
- Added `src/components/MetadataSummary/` with a right-aligned summary box for image and metadata properties.
- Added `src/components/Article/` with an article wrapper that renders title, `MetadataSummary`, and section cards.
- Updated app theme to dark fantasy style and root navigation state handling.
