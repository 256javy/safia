import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*/simulator/', '/api/'],
      },
    ],
    sitemap: 'https://safia.app/sitemap.xml',
  }
}
