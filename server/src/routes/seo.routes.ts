import { Router, Request, Response } from 'express';
import prisma from '../config/prisma.js';

const router = Router();



const escapeXml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getBaseUrl = (req: Request): string => {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5001';
  return `${protocol}://${host}`;
};

// GET /robots.txt
router.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /seller',
    'Disallow: /login',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n');

  res.type('text/plain; charset=utf-8');
  return res.status(200).send(content);
});

// GET /sitemap.xml
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);

    // Navbar ও Footer-এর পাবলিক স্ট্যাটিক পেজগুলো
    const staticPaths = [
      '/',
      '/items',
      '/about',
      '/stores',
      '/contact',
      '/order-tracking',
      '/privacy-policy',
      '/terms',
      '/faq',
    ];

    const products = await prisma.product.findMany({
      select: {
        id: true,
        category: true,
        subCategory: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const urlMap = new Map<string, { loc: string; lastmod?: string; changefreq: string; priority: string }>();

    // স্ট্যাটিক রাউট যুক্ত করা
    for (const routePath of staticPaths) {
      urlMap.set(routePath, {
        loc: `${baseUrl}${routePath}`,
        changefreq: routePath === '/' ? 'daily' : 'weekly',
        priority: routePath === '/' ? '1.0' : '0.7',
      });
    }

    // প্রোডাক্ট, ক্যাটাগরি ও সাব-ক্যাটাগরি থেকে ডাইনামিক URL যুক্ত করা
    for (const product of products) {
      const lastmodDate = (product.updatedAt || product.createdAt)?.toISOString().split('T')[0];

      if (product.category) {
        const catPath = `/items?category=${encodeURIComponent(product.category)}`;
        const existingCat = urlMap.get(catPath);
        urlMap.set(catPath, {
          loc: `${baseUrl}${catPath}`,
          lastmod: lastmodDate || existingCat?.lastmod,
          changefreq: 'daily',
          priority: '0.8',
        });

        if (product.subCategory) {
          const subCatPath = `/items?category=${encodeURIComponent(product.category)}&subCategory=${encodeURIComponent(product.subCategory)}`;
          const existingSub = urlMap.get(subCatPath);
          urlMap.set(subCatPath, {
            loc: `${baseUrl}${subCatPath}`,
            lastmod: lastmodDate || existingSub?.lastmod,
            changefreq: 'daily',
            priority: '0.75',
          });
        }
      }

      // প্রোডাক্ট ডিটেইল রাউট (আপনার ফ্রন্টএন্ডে প্রোডাক্ট পেজের পাথ /product/:id হলে এটি কাজে লাগবে)
      const productPath = `/product/${encodeURIComponent(product.id)}`;
      urlMap.set(productPath, {
        loc: `${baseUrl}${productPath}`,
        lastmod: lastmodDate,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    const urlsXml = Array.from(urlMap.values())
      .map((entry) => {
        const lastmodTag = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
        return [
          '  <url>',
          `    <loc>${escapeXml(entry.loc)}</loc>${lastmodTag}`,
          `    <changefreq>${entry.changefreq}</changefreq>`,
          `    <priority>${entry.priority}</priority>`,
          '  </url>',
        ].join('\n');
      })
      .join('\n');

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urlsXml,
      '</urlset>',
    ].join('\n');

    res.type('application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('SITEMAP GENERATION ERROR:', error);
    return res.status(500).send('Failed to generate sitemap');
  }
});

export default router;