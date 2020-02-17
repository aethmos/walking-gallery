import React from 'react';
import Layout from '../components/layout';
import {graphql} from "gatsby";
import Slider from "../components/Slider";

const IndexPage = ({data: {categories, imagesByCategory}}) => {
    const totalImages = categories.totalCount;
    const sections = categories.nodes.map(category => {
        let images = imagesByCategory
            .group
            .filter(group => group.edges[0].node.relativeDirectory === category.relativeDirectory)[0]
            .edges
            .map(edge => edge.node);
        category.totalImages = images.length;
        category.image = images[category.thumbIdx];
        category.text = category.title;
        category.link = `/${category.relativeDirectory}/`;
        return category;
    }).filter(category => category.image !== undefined);

    return (
        <Layout title={`${totalImages} Collections`} image={sections[0].image.childImageSharp.fluid.src} showHomeButton={false}>
            {(sensorActive, debugPanelActive) => <Slider initialIndex={1} sections={sections} sensorActive={sensorActive} insideSection={false} debugPanelActive={debugPanelActive}/>}
        </Layout>
    );
};

export const query = graphql`
    query CategoriesAndImages{
        categories: allCategoryJson(
            sort : {
                order: DESC,
                fields: date
            }
        ) {
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
                                srcSet
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default IndexPage;
