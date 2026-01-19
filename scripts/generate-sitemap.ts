import { create } from 'xmlbuilder2';
import { blogPosts } from '../src/data/blogPosts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://zolisasilolo.co.za';
const staticRoutes = [
  '/',
  '/blog',
  '/portfolio',
  '/about',
  '/chat'
];

const doc = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

// Add static routes
staticRoutes.forEach(route => {
  doc.ele('url')
    .ele('loc').txt(`${baseUrl}${route}`).up()
    .ele('changefreq').txt('daily').up()
    .ele('priority').txt(route === '/' ? '1.0' : '0.8').up();
});

// Add blog posts
blogPosts.forEach(post => {
  doc.ele('url')
    .ele('loc').txt(`${baseUrl}/blog/${post.slug}`).up()
    .ele('lastmod').txt(post.date).up()
    .ele('changefreq').txt('weekly').up()
    .ele('priority').txt('0.9').up();
});

const xml = doc.end({ prettyPrint: true });

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log('Sitemap generated successfully at ' + path.join(publicDir, 'sitemap.xml'));
