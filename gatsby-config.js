module.exports = {
  // pathPrefix: `/interactive_gallery/`, // This path is subpath of your hosting https://domain/portfolio
  siteMetadata: {
    title: 'Walking Gallery',
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
        background_color: '#111',
        theme_color: '#111',
        display: 'standalone',
        icon: 'src/assets/img/favicon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
  ],
};
