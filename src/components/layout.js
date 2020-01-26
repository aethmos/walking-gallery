import React from 'react';
import PropTypes from 'prop-types';
import {StaticQuery, graphql, Link} from 'gatsby';
import Helmet from 'react-helmet';
import { Icon} from "@iconify/react";
import home from "@iconify/icons-mdi-light/home";
import activatedSensor from "@iconify/icons-mdi-light/eye";
import suspendedSensor from "@iconify/icons-mdi-light/eye-off";
import '../assets/sass/global.scss';
import styles from './layout.module.scss';

function Header({showHomeButton, title, sensorActive = false}) {
    return <div className={styles.header}>
        <div className={styles.backBtn} style={{opacity: showHomeButton ? 1 : 0}}><Link to='/'><Icon icon={home}/></Link></div>
        <div className={styles.title}><h1>{title}</h1></div>
        <div className={styles.suspendBtn}><Icon icon={sensorActive ? activatedSensor : suspendedSensor}/></div>
    </div>;
}

Header.propTypes = {
    title: PropTypes.any,
    meta: PropTypes.any
};
const Layout = ({ children, title, image, showHomeButton = true}) => (
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

        <Header title={title || meta.title} showHomeButton={showHomeButton}/>
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
