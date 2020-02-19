import React, {useState} from 'react';
import {graphql, StaticQuery} from 'gatsby';
import Helmet from 'react-helmet';
import '../assets/sass/global.scss';
import Header from "./header";

const Layout = ({children, title, image, showHomeButton = true}) => {
    const [sensorActive, setSensorActive] = useState(true);
    const [debugPanelActive, setDebugPanelActive] = useState(false);

    return (
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
            render={({site: {siteMetadata: meta}}) => (
                <>
                <Helmet>
                    {/* General tags */}
                    <html lang="en"/>
                    <title>{title || meta.title}</title>
                    <meta name="description" content={meta.description}/>
                    <meta name="keywords" content={meta.keywords}/>
                    {image ? <meta name="image" content={image}/> : null}
                    <link rel="canonical" href={meta.siteUrl}/>

                    {/* OpenGraph tags */}
                    <meta property="og:url" content={meta.siteUrl}/>
                    {<meta property="og:type" content="album"/>}
                    <meta property="og:title" content={title}/>
                    <meta property="og:description" content={meta.description}/>
                    {image ? <meta property="og:image" content={image}/> : null}

                    {/* Twitter Card tags */}
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:creator" content={meta.twitterHandle}/>
                    <meta name="twitter:title" content={title}/>
                    <meta name="twitter:description" content={meta.description}/>
                    {image ? <meta name="twitter:image" content={image}/> : null}

                    {/* make title bar match the header */}
                    <meta name="theme-color" content="#ffffff" />
                </Helmet>

                <Header title={title || meta.title} {...{showHomeButton, sensorActive, setSensorActive, debugPanelActive, setDebugPanelActive}}/>
                <main className='content'>
                    {children(sensorActive, debugPanelActive)}
                </main>
                </>
                )}
        />
    );
};

export default Layout;
