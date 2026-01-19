import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { blogPosts } from '../src/data/blogPosts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, p);
import { pathToFileURL } from 'node:url';

const template = fs.readFileSync(toAbsolute('../dist/client/index.html'), 'utf-8');
const { render } = await import(pathToFileURL(toAbsolute('../dist/server/entry-server.js')).href);

const routesToPrerender = [
  '/',
  '/blog',
  '/portfolio',
  '/about',
  '/chat',
  '/admin',
  ...blogPosts.map((post) => `/blog/${post.slug}`),
];

(async () => {
  for (const url of routesToPrerender) {
    const context = {};
    const appHtml = render(url, context);
    const { html, helmet } = appHtml;

    const htmlContent = template
      .replace('<!--app-html-->', html) // We need to add this placeholder to index.html or replace root div content
      .replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      )
      .replace(
        '<!--head-meta-->',
        helmet.title.toString() + helmet.meta.toString() + helmet.link.toString()
      );

    const filePath = `../dist/client${url === '/' ? '/index.html' : `${url}/index.html`}`;
    const fullFilePath = toAbsolute(filePath);
    const dir = path.dirname(fullFilePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullFilePath, htmlContent);
    console.log('pre-rendered:', filePath);
  }
})();
