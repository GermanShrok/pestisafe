# PestiSafe

A working product demo for the PestiSafe First Lego League (FLL) project — a proposed smart sensor that
helps farmers reduce pesticide-drift risk to pollinators. Rather than an explainer page (the team has a
separate presentation for that), this is a multi-page mock app judges can click through.

Pages (see the top nav, and the "Demos" dropdown):

- **Dashboard** (`/`, `src/pages/Dashboard.jsx`) — a live farm-safety-monitor mock. Cycles through
  illustrative sensor readings via "Simulate next reading" and shows the resulting
  **Green / Yellow / Red** signal, the readings behind it, and a recommendation.
- **Spraying simulator** (`/simulator`, `src/components/RiskSimulator.jsx`) — drag sliders and pick crop /
  pesticide type to see the Green/Yellow/Red signal update live, backed by the risk logic in
  `src/lib/riskAssessment.js`.
- **AI insect scanner** (`/insect-scanner`, `src/pages/InsectScanner.jsx`) — pick a sample insect photo and
  get a mocked pollinator/pest classification (`src/lib/insectCatalog.js`). Not a live AI model.
- **Pesticide checker** (`/pesticide-checker`, `src/pages/PesticideChecker.jsx`) — pick a product (including
  Matador 120EC, the example from the team's mentor feedback) and field conditions to see an illustrative
  label-restriction warning (`src/lib/pesticideChecker.js`).

All demo data is clearly illustrative — every page says so — since none of it is backed by real sensors,
a real model, or a live pesticide-label database.

## Development

```bash
npm install
npm run dev       # start the local dev server
npm test          # run the full unit test suite once
npm run test:watch # run tests in watch mode while developing
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Every change to the risk logic or components should come with a matching test in the same file's
`*.test.js(x)` sibling — see `src/lib/riskAssessment.test.js` for the risk-logic test suite and
`src/components/*.test.jsx` for component tests. CI (`.github/workflows/ci.yml`) runs `npm test` and
`npm run build` on every push and pull request to `main`.

## Hosting

The app is a static site (`npm run build` outputs `dist/`), so any static host works. The two easiest:

**Netlify**
1. Push this repo to GitHub.
2. In Netlify: "Add new site" → "Import an existing project" → pick the repo.
3. Build command: `npm run build`, publish directory: `dist`. Netlify auto-detects this from `netlify.toml`-free
   Vite projects, but set it manually if asked.

**GitHub Pages**
1. Push this repo to GitHub.
2. Add `base: '/<repo-name>/'` to `vite.config.js`'s `defineConfig` if the repo isn't served from the
   domain root.
3. Use a `gh-pages` deploy action, or run `npm run build` and push the `dist/` folder to a `gh-pages` branch.

**Vercel**
1. Push this repo to GitHub.
2. In Vercel: "Add New Project" → import the repo. It auto-detects Vite; no config needed.
