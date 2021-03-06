import React from 'react';
import Layout from '../components/layout';
import {graphql} from "gatsby";
import Slider from "./slider";

const AlbumPageTemplate = ({data: {category, images}}) => {
    const totalImages = images.edges.length;
    const sections = images.edges.map((edge, index) => ({
        image: edge.node,
        text: `${index + 1} / ${totalImages - 1}`
    }));

    return (
        <Layout title={category.title} image={sections[category.thumbIdx].image.childImageSharp.fluid.src}>
            {(sensorActive, debugPanelActive) => <Slider sections={sections} sensorActive={sensorActive} debugPanelActive={debugPanelActive}/>}
        </Layout>
    );
};

export const query = graphql`
            query CategoryAndImages($categoryId: String, $categoryDirectory: String) {
                category: categoryJson(id: { eq: $categoryId}) {
                    id
                    title
                    relativeDirectory
                    date(fromNow: true)
                    thumbIdx
                }
                images: allFile(
                filter: {
                    extension: {regex: "/jpg|png/"}, 
                    relativeDirectory: {eq: $categoryDirectory}
                }, sort: {
                    order: ASC, 
                    fields: name
                })
                {
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
        `;

export default AlbumPageTemplate;
