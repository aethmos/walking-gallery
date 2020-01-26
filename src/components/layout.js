import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import styles from './layout.module.scss';

import '../assets/sass/global.scss';
const Layout = ({ children, title, image }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `}
    render={({site: { siteMetadata: meta}}) => (
      <>
        <Helmet>
            {/* General tags */}
            <html lang="en" />
            <title>{title || meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="keywords" content={meta.keywords} />
            { image ? <meta name="image" content={image} /> : null}
            <link rel="canonical" href={meta.siteUrl} />

            {/* OpenGraph tags */}
            <meta property="og:url" content={meta.siteUrl} />
            {<meta property="og:type" content="album" />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={meta.description} />
            { image ? <meta property="og:image" content={image} /> : null}

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={meta.twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={meta.description} />
            { image ? <meta name="twitter:image" content={image} /> : null}
        </Helmet>

        {/* header */}
        <div className={styles.header}><h1>{title || meta.title}</h1></div>
        <div className={styles.page}>
            {children}
        </div>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
