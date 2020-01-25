import React from 'react';
import Layout from '../components/layout';
import CategoryCarousel from "../components/CategoryCarousel";
import {graphql} from "gatsby";

const IndexPage = ({data: { categories, imagesByCategory }}) => {
    categories = categories.nodes.map(category => {
        let images =
            imagesByCategory
            .group
            .filter(group => group.edges[0].node.relativeDirectory === category.relativeDirectory)
            .edges
            .map(edge => edge.node);

        category.totalImages = images.length;
        for (let i = 0; i < images.length; i++) {
            if (i === category.thumbIdx) {
                category.thumbnail = images[i];
                break;
            }
        }
        return category;
    }).filter(category => category.thumbnail !== undefined);

    return (
        <Layout>
            <CategoryCarousel categories={categories.nodes} />
        </Layout>
    );
};

export const query = graphql`
            query CategoriesAndThumbnails{
                categories: allCollectionsJson {
                    nodes {
                        id
                        title
                        relativeDirectory
                        date(fromNow: true)
                        thumbIdx
                    }
                    totalCount
                }
                imagesByCategory: allFile(
                    filter: {
                        extension: {regex: "/jpg|png/"}
                    }, sort: {
                        order: ASC,
                        fields: name
                    })
                {
                    group(field: relativeDirectory) {
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
            }
        `;

export default IndexPage;
