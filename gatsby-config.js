module.exports = {
  // pathPrefix: `/interactive_gallery/`, // This path is subpath of your hosting https://domain/portfolio
  siteMetadata: {
    title: 'Walking Gallery',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Walking Gallery',
        short_name: 'gallery',
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
