import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safia.app'
  const locales = ['es', 'en', 'pt']
  const staticPages = ['', '/courses', '/roadmap', '/legal/privacy', '/legal/terms']

  const entries: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }
  return entries
}
