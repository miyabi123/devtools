/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://freeutil.app',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/dashboard/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api'],
      },
    ],
  },
  transform: async (_config, path) => {
    let priority = 0.7
    let changefreq = 'monthly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'weekly'
    } else if (path === '/tools') {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path.startsWith('/tools/')) {
      priority = 0.8
      changefreq = 'monthly'
    } else if (path === '/privacy') {
      priority = 0.3
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
