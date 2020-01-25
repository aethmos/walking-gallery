import React from 'react';
import Layout from '../components/layout';
import CategoryCarousel from "../components/CategoryCarousel";
import {graphql} from "gatsby";

const IndexPage = ({data}) => (
    <Layout>
        <CategoryCarousel categories={data.categories.nodes} thumbnails={data.thumbnails.edges.map(edge => edge.node)}/>
    </Layout>
);

export const query = graphql`
            query CategoriesAndThumbnails{
                categories: allCollectionsJson {
                    nodes {
                        id
                        slug
                        title
                        relativeDirectory
                        date(fromNow: true)
                        startIdx
                    }
                    totalCount
                }
                thumbnails: allFile(
                filter: {
                    extension: {regex: "/jpg|png/"}, 
                    name: {regex: "/thumb.*/i"}
                }, sort: {
                    order: ASC, 
                    fields: name
                }) {
                    edges {
                        node {
                            id
                            name
                            extension
                            relativeDirectory
                            childImageSharp {
                                fluid(maxHeight: 1920, quality: 75, cropFocus: ATTENTION) {
                                    aspectRatio
                                    sizes
                                    src
                                }
                            }
                        }
                    }
                }
            }
        `;

export default IndexPage;
