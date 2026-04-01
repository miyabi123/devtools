/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://freeutil.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/dashboard/*', '/api/*'],
  additionalPaths: async (config) => {
    const { tools } = require('./lib/tools.ts')
    return tools.map((tool) => ({
      loc: `/tools/${tool.slug}`,
      changefreq: 'weekly',
      priority: tool.isPopular ? 0.9 : 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/dashboard', '/api'] },
    ],
  },
  transform: async (config, path) => {
    const priority = path === '/' ? 1.0 : path === '/tools' ? 0.9 : 0.8
    return {
      loc: path,
      changefreq: 'weekly',
      priority: priority,
      lastmod: new Date().toISOString(),
    }
  },
}