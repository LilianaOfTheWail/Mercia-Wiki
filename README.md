# Mercia Wiki

This repository is a Vite + React application with a minimal component architecture.

## Project conventions

- Reusable UI components are stored under `src/components/<component-name>/`.
- Shared types and wiki configuration live under `src/common/`, especially `src/common/user-data/index.ts`.
- Data-driven navigation is configured from `src/common/user-data/index.ts`.
- Article data lives under `public/data-config/*.json`.
- Component code should stay simple and explicit over clever.
- Dark fantasy styling is encouraged for global theme and reusable page sections.

## How To Add Or Change Wiki Content

Use this checklist when you want to add a new content bucket such as `regions`, `orders`, or when you are forking the wiki and want to reshape the content/configuration for a new project.

### 1. Update the shared wiki config

Start in `src/common/user-data/index.ts`.

This file is the single source of truth for wiki-specific setup:

- data domain names
- file-name mapping for each domain
- sidebar groups and leaf navigation
- any domain aliases such as `nobility -> noble-houses`

When you add a new content domain, extend `DATA_SOURCE_FILE_NAMES` and, if needed, `WIKI_NAV_CONFIG`.

### 2. Add the JSON file

Create a new file in `public/data-config/`, for example:

```text
public/data-config/regions.json
```

Match the existing shape:

```json
{
  "regions": [
    {
      "name": "Northreach",
      "metadata": {
        "title": "Northern capital"
      },
      "sections": []
    }
  ]
}
```

Notes:

- The top-level JSON key should match the data domain name.
- Each entry should at least have a `name`.
- `metadata` is optional, but it is the easiest place to store summary fields.
- `sections` is optional, and it can contain text sections or query-driven sections.

### 3. Make article queries point at it

If you want article sections to render a table-of-contents style list from the new source, use a `query` section with the new domain:

```ts
{
  key: 'Regions',
  query: {
    domain: 'regions',
    filters: {
      shouldInclude: [],
      shouldExclude: []
    },
    dataFields: ['title']
  }
}
```

The query helpers in `src/utils/dataView.ts` and `src/utils/dataService.ts` will fetch the file automatically as long as the domain has been added to `src/common/user-data/index.ts`.

### 4. Add internal links if needed

If entries in the new data source should link to other articles, add `links` inside the `sections` content the same way the existing kingdom and character entries do.

### 5. Verify the new source

After wiring everything up:

- Run the app and open the new category in the sidebar, if you added one.
- Open a page or article that queries the new domain.
- Confirm the JSON file is being served from `public/data-config/`.
- Check that slugs, labels, and nested items resolve the way you expect.

## Project files

- `package.json` contains scripts for `dev`, `build`, and `preview`.
- `vite.config.js` configures Vite with the React plugin.
- `index.html` is the single page entry point.
- `src/main.jsx` bootstraps the React app.
- `src/App.jsx` is the root application component.
- `src/index.css` provides global styles.
- `src/components/LateralBar/` holds the lateral navigation component.
- `src/common/user-data/index.ts` centralizes wiki-specific config for domains, nav groups, aliases, and file mapping.
- `src/utils/contentSources.ts` remains a thin compatibility wrapper over the shared wiki config.

## Changelog

- Initial setup: created Vite + React scaffold and project conventions.
- Added `Agent.md` to define component structure, page rules, ES5 logic, and README documentation requirements.
- Added `src/components/LateralBar/` with a collapsible lateral navigation bar driven by shared wiki config.
- Added `src/components/SectionBox/` with a reusable section panel that converts `[[Name]]` tokens into anchor links.
- Added `src/components/MetadataSummary/` with a right-aligned summary box for image and metadata properties.
- Added `src/components/Article/` with an article wrapper that renders title, `MetadataSummary`, and section cards.
- Added `src/common/user-data/` to keep wiki-specific configuration in one place for forkable setup.
- Updated app theme to dark fantasy style and root navigation state handling.
