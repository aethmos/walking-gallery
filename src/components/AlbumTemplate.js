import React from 'react';
import Layout from '../components/layout';
import {graphql} from "gatsby";
import styles from "./Slider.module.scss";
import Slider from "../components/Slider";
import BackgroundImage from "gatsby-background-image";

const AlbumTemplate = ({data: {category, images}}) => {
    const totalImages = images.length;
    const sections = images.edges.map((edge, index) => ({
        image: edge.node,
        text: `${index} / ${totalImages}`
    }));

    return (
        <Layout title={category.title} image={sections[category.thumbIdx].image.childImageSharp.fluid.src}>
            <Slider sections={sections}/>
        </Layout>
    );
};

export const query = graphql`
            query CategoryAndImages($categoryId: String, $path: String) {
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
                    relativeDirectory: {eq: $path}
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

export default AlbumTemplate;
