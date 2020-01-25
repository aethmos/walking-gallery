import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import styles from './layout.module.scss';

import '../assets/sass/global.scss';
const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'A web gallery which can be navigated by moving around.' },
            { name: 'keywords', content: 'walking, gallery, photography, portfolio, site, web, gallery, gatsby, augmented reality, react' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <div className={styles.header}><h1>{data.site.siteMetadata.title}</h1></div>
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
