module.exports = {
  // pathPrefix: `/interactive_gallery/`, // This path is subpath of your hosting https://domain/portfolio
  siteMetadata: {
    siteUrl: 'https://gallery.aethmos.com',
    title: 'Walking Gallery',
    description: 'A web gallery which can be navigated by moving around.',
    author: 'Dennis Osipov',
    twitterHandle: '@aethmos',
    keywords: 'walking, gallery, photography, portfolio, site, web, gallery, gatsby, augmented reality, react'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Walking Gallery',
        short_name: 'Walking Gallery',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        icon: 'src/assets/img/favicon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
  ],
};
