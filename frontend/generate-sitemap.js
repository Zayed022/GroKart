// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap"
import { createWriteStream } from 'fs'

const sitemap = new SitemapStream({ hostname: 'https://grokartapp.com' });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/cart' },
  { url: '/about' },
  { url: '/contact' },
  { url: '/register' },
  { url: '/login' },
  { url: '/category/electronics' },
  { url: '/subCategory/mobiles' },
  { url: '/minicategory/smartphones' },
  { url: '/all-products' },
  { url: '/products/123' }, // example product ID
  { url: '/address' },
  { url: '/checkout' },
  { url: '/payment' },
  { url: '/payment-success' },
  { url: '/order-history' },
  { url: '/mini' },
  { url: '/category' },
  { url: '/contact-us' },
  { url: '/terms-conditions' },
  { url: '/cancellation' },
  { url: '/policy' },
  { url: '/offers' },
];

links.forEach(link => sitemap.write(link));
sitemap.end();

streamToPromise(sitemap).then(data => {
  createWriteStream('./public/sitemap.xml').write(data.toString());
  console.log('✅ Sitemap generated and saved to public/sitemap.xml');
});
