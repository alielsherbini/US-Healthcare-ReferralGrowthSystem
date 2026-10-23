# SCOPES Health Referral Growth Ecosystem — GitHub Pages preview

This is the corrected source project for your React + TypeScript + Vite application. It preserves the dashboard design and nine tabs, restores the folders expected by the imports, and adds automatic GitHub Pages deployment.

## Why a white page can happen

The uploaded `index.html` points to `/src/main.tsx`. This is a source entry point that Vite must compile. GitHub Pages serves static files and does not compile TSX simply because it appears on the `main` branch. Deploying the original source directory directly can therefore leave the React root empty.

The original Vite config also used its default root asset path. On a repository site such as `https://USERNAME.github.io/scopes-health-referral-growth-ecosystem/`, root asset URLs can request files outside the repository path. This project uses `base: './'`, so the built bundles load relative to the deployed page.

The exact cause of the earlier live failure cannot be confirmed without the repository URL or browser errors. These are problems identified in the supplied export and deployment setup.

## Folder placement

Keep these paths intact. The source files do not all belong in one flat folder.

| Path relative to repository root | Purpose |
| --- | --- |
| `index.html` | Vite HTML entry |
| `package.json`, `package-lock.json` | Build scripts and locked dependencies |
| `vite.config.ts`, `tsconfig.json` | Build and TypeScript configuration |
| `.github/workflows/deploy.yml` | GitHub Actions deployment |
| `src/main.tsx` | Mounts the React application |
| `src/App.tsx` | Sidebar, tab switching, role simulation |
| `src/components/` | All nine tab components |
| `src/context/AppContext.tsx` | Shared application state and mutations |
| `src/data/seedData.ts` | Bundled preview dataset |
| `src/types.ts`, `src/storage.ts`, `src/index.css` | Types, resilient browser storage, styles |

## Recommended publishing route: source + GitHub Actions

Use this route for future changes. It builds and deploys automatically on every push to `main`.

1. Extract `scopes-health-github-pages-kit.zip`. Open its `source` folder. The `package.json` file is directly inside it.
2. Clone your GitHub repository with GitHub Desktop. Open the local repository folder in Finder.
3. Copy the **contents** of the extracted project folder into the repository folder, preserving `src/` and `.github/`. Do not add an extra outer project folder around these contents. Never replace the repository's `.git` directory. If replacing an existing attempt, remove only old application files that conflict with this corrected structure, keeping unrelated files.
4. In Finder, press **Command + Shift + .** to show hidden files. Confirm that `.github/workflows/deploy.yml` was copied. This is essential.
5. In GitHub Desktop, review the changes, commit to `main`, and push. Do not upload `node_modules/` or `dist/`; `.gitignore` excludes both.
6. In the GitHub repository, open **Settings → Pages**. Under **Build and deployment → Source**, select **GitHub Actions**.
7. Open **Actions → Deploy SCOPES preview to GitHub Pages**. If the first run happened before Pages was configured and failed, use **Re-run all jobs**. You can also use **Run workflow → main**.
8. Wait for the workflow to turn green. Return to **Settings → Pages** and use the published URL displayed there. It will normally be `https://USERNAME.github.io/REPOSITORY/`.

You do not need to install Node locally for GitHub Actions to build this project. No API key or repository secret is required for the current preview.

### If uploading through GitHub's website

Use **Add file → Upload files** to upload `src/` and the root files from the extracted project. Upload their contents, not the ZIP itself and not an extra enclosing folder. Preserve the folders under `src/`.

Hidden `.github` folders can be missed by upload dialogs. To ensure the workflow exists, choose **Add file → Create new file**, enter `.github/workflows/deploy.yml` as the filename, and paste the contents of that file from the extracted project. Commit it to `main`. Then follow steps 6–8 above.

## Fast alternative: upload the already-built preview

The kit's `preview-static/` folder contains the compiled site. Use this for a quick preview if you prefer publishing from a branch.

1. Open `preview-static/`. Its `index.html`, `assets/` folder, and `.nojekyll` file are the deployable site.
2. In your existing repository, create a dedicated branch named `gh-pages` from the branch selector.
3. Upload the extracted **contents** to the root of that branch. Preserve the `assets/` folder. Do not put the ZIP itself or its enclosing folder on the branch. Ensure the built `index.html` is at the branch root. If Finder hides `.nojekyll`, show hidden files or create an empty file of that name through GitHub.
4. Open **Settings → Pages**, select **Deploy from a branch**, choose **gh-pages** and **/(root)**, and save.
5. Open the URL shown in Pages after deployment completes.

Choose one Pages publishing source. To return to automatic builds, select **GitHub Actions** again. The static preview is a snapshot; source changes require a rebuild and another static upload.

## Run locally, if desired

Install Node.js 22.12 or later. Open a terminal in the source project folder:

```bash
npm ci
npm run dev
```

To verify the production build:

```bash
npm run build
npm run preview
```

Open the URL printed in the terminal. Do not open `index.html` by double-clicking it.

## Changes included

- Restored canonical filenames without download suffixes such as `(1)` and `(2)`.
- Restored `src/components`, `src/context`, and `src/data` to match imports.
- Set Vite's relative asset base and made its alias configuration work in ES modules.
- Added a Pages workflow, lockfile, Node requirement, and ignore rules.
- Added React TypeScript definitions and type-checking to the build.
- Corrected the Add Lead input type to exclude history fields initialized inside the provider.
- Removed the AI Studio fetch-interceptor patch from the HTML and unused server/AI dependencies. The supplied app makes no backend or Gemini API calls.
- Initialized browser state before rendering and added fallback handling for malformed saved JSON or blocked browser storage.
- Limited Reset to SCOPES data rather than clearing every application's localStorage on the same origin.

## Preview scope and code-review findings

| Area | Current behavior |
| --- | --- |
| Shared state | CRM, tasks, content, meetings, scoring and dashboard use the same context. The blueprint stores its milestones separately. |
| Routing | Tabs use React state. No React Router, server rewrites, or 404 fallback is required. Reloading returns to the dashboard. |
| Persistence | Data is saved in each visitor's browser. There is no shared database or cross-device synchronization. Storage uses the original `scopes_*` keys, so another copy on the same origin can share those values. |
| Roles | The role selector simulates UI permissions. Visitors can choose Admin; this is not authentication. |
| Outreach | Templates are copied for manual use. Email and LinkedIn sending are not integrated. |
| AI personalization | A timeout and text template simulate generation. No AI service is called. |
| Reports | Metrics mostly derive from shared state, but Export CSV only shows an alert. The report-period selector does not filter calculations. |
| Dates and scoring | Dashboard system time and score-decay reference are fixed to June 25, 2026. Seed dates, some headline metrics, growth percentages, and report text are demo values. |
| Stage logic | Recalculating scores can replace marketing stages according to thresholds; manual stage choices may be overwritten. This behavior was retained. |
| Prospecting | Suggested firms are hardcoded sample entries, not live search results. |
| Archive | The CRM action sets `status: 'archived'`, but the list and dashboard do not filter archived records out. This behavior was retained. |

Treat this as a demonstration with bundled example data. A team production version needs a backend, authentication, shared persistence, and completion of the simulated features. GitHub Pages is suitable for the current frontend preview.

## Troubleshooting

- **Workflow says package.json or lockfile not found:** the project is nested one level too deep. This workflow expects both at the repository root.
- **No deployment workflow appears:** confirm `.github/workflows/deploy.yml` exists on `main`.
- **Pages configuration error:** select GitHub Actions in Settings → Pages, then rerun the workflow.
- **Workflow never runs:** its push trigger targets `main`; rename the source branch or edit that trigger to match your branch.
- **White page / missing JS:** confirm you deployed `dist` through the workflow or the compiled static ZIP through the branch route. Inspect the browser Console and Network tabs for the first error. Hard-refresh once after a successful deployment.
- **404 on the site:** use the exact URL from Settings → Pages, including the repository name and trailing slash.
- **New data is absent on another device:** browser-local persistence is the current design.

Official references: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [Vite relative base](https://vite.dev/guide/build.html#relative-base), [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
