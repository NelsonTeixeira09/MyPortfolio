# MyPortfolio
Personal developer portfolio showcasing my experience, projects and certifications in OutSystems and SAP CAP, with a futuristic 3D design.

Deployed on Netlify: every push to `main` rebuilds the site (settings in `netlify.toml`).

## Stack
- **Vite** — dev server and build
- **Vanilla JS + CSS** — no framework; the page is rendered to static HTML at build time
- **Three.js** — the hero orb, lazy-loaded after the content, with a CSS fallback when WebGL is unavailable

## Editing content
All text lives in **`src/content.js`** (about, experience, projects, skills, certifications, education, contact).
Anything in `[square brackets]` is a placeholder — it shows with a dashed underline on the site until you replace it.

## Commands
```bash
npm install        # once
npm run dev        # local dev server with live reload
npm run build      # production build into dist/
npm run preview    # serve the build locally
npm run validate   # HTML validation of dist/index.html (run after build)
```

## Structure
```
src/content.js   ← your content
src/render.js    ← turns content into semantic HTML (build time)
src/main.js      ← navigation, scroll reveals, card tilt, copy email, 3D loader
src/scene.js     ← Three.js hero scene (custom shaders)
src/styles.css   ← design tokens and all styles
```
