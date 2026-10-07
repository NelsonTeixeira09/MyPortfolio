import { defineConfig } from 'vite';
import { fileURLToPath, pathToFileURL } from 'node:url';

const contentFile = fileURLToPath(new URL('./src/content.js', import.meta.url));
const renderFile = fileURLToPath(new URL('./src/render.js', import.meta.url));

/** Renders src/content.js into index.html so the page ships as static HTML. */
function portfolioHtml() {
  return {
    name: 'portfolio-html',
    async transformIndexHtml(html) {
      const bust = `?t=${Date.now()}`;
      const { content } = await import(pathToFileURL(contentFile).href + bust);
      const { render } = await import(pathToFileURL(renderFile).href + bust);
      const page = render(content);
      return html
        .replaceAll('__TITLE__', page.title)
        .replaceAll('__DESCRIPTION__', page.description)
        .replace('<!--app-->', page.body);
    },
    handleHotUpdate({ file, server }) {
      if (file === contentFile || file === renderFile) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  // Relative base so the build works on any host or sub-path (e.g. GitHub Pages).
  base: './',
  // three.js is lazy-loaded with the hero scene, so its size doesn't block first paint.
  build: { chunkSizeWarningLimit: 700 },
  plugins: [portfolioHtml()],
});
