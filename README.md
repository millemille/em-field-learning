# EM Field Lab

Interactive electromagnetism learning page with a refined dark editorial theme.

- **Electrostatics lab** — point charges, 3D electric field arrows, field lines, test charge force `F = qE`
- **Power & circuits lab** — ideal DC circuit `P = IV` with 3D schematic and electron flow

## Stack

- Vite + React 19 + TypeScript
- React Three Fiber + Three.js + postprocessing bloom
- Tailwind CSS 4 + Radix UI sliders/tabs

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Static output is in `dist/` — deploy to Vercel, GitHub Pages, or any static host.

## GitHub Pages

Live site: [https://millemille.github.io/em-field-learning/](https://millemille.github.io/em-field-learning/)

Pushes to `main` run `.github/workflows/deploy-pages.yml`, which builds Vite and deploys `dist/`.

**One-time repo setup:**

1. GitHub repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions** (not “Deploy from branch” on raw source)
3. Push these fixes to `main` and wait for the workflow to finish (Actions tab)

`vite.config.ts` sets `base: '/em-field-learning/'` so assets load under the project URL path.

## Notes

- Physics uses analytic formulas (Coulomb, Ohm’s law), not a SPICE simulator.
- WebGL is required for the lab viewport.
