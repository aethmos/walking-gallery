import React from 'react';
import Layout from '../components/layout';
import {graphql, Link} from "gatsby";
import BackgroundImage from 'gatsby-background-image'

import styles from '../components/CarouselSlide.module.scss'
let maxZIndex = 0;

const IndexPage = ({data}) => (
    <Layout>
        <div className={styles.header}><h1>{data.collections.totalCount} Collections</h1></div>
        <ul>
            {data.collections.nodes.map(collection => {
                let images = data.images.group.filter(group => group.edges[0].node.relativeDirectory === collection.directory)[0];
                console.log(images.edges);
                let coverImage = images.edges[0].node.childImageSharp.fluid;

                return (
                    <li key={collection.id} style={{zIndex: maxZIndex--}}>
                        <Link to={'/' + collection.slug + '/'}>
                            <BackgroundImage Tag={'div'} className={styles.slide} fluid={coverImage} style={{zIndex: maxZIndex--}}>
                                <div className={styles.descriptionPanel}>
                                    <h3>{collection.title}</h3>
                                    <span>{images.totalCount} images</span>
                                    <span>{collection.date}</span>
                                </div>
                            </BackgroundImage>
                        </Link>
                    </li>
                )
            })}
        </ul>
    </Layout>
);

export const query = graphql`
    query CollectionsQuery {
        collections: allCollectionsJson(
                sort: {order: DESC, fields: date}, 
#                filter: {directory: {regex: "/2020/"}}
        ) {
            nodes {
                id
                slug
                title
                directory
                date(fromNow: true)
            }
            totalCount
        }

        images: allFile(
                filter: {extension: {regex: "/jpg|png/"}}, 
                sort: {order: ASC, fields: name}
        ) {
            group(field: relativeDirectory, limit: 1) {
              edges {
                node {
                  relativePath
                  absolutePath
                  relativeDirectory
                  name
                  id
                  extension
                  childImageSharp {
                    fluid(
                      cropFocus: ATTENTION, 
                      maxHeight: 1920
                    ) {
                      src
                    }
                  }
                }
              }
              totalCount
            }
          }
    }
`;

export default IndexPage;
