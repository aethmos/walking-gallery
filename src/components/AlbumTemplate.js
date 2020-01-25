import React from 'react';
import Layout from '../components/layout';
import Carousel from "./Carousel";
import {graphql} from "gatsby";

const AlbumTemplate = ({data: {category, images}}) => {
    images = images.edges.map(edge => {
        let image = edge.node;
        image.category = category;
        return image;
    });
    category.totalImages = images.length;
    return (
        <Layout>
            <Carousel images={images}/>
        </Layout>
    );
};

export const query = graphql`
            query CategoriesAndThumbnails{
                category: categoryJson(relativeDirectory: { eq: $path}) {
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
                        nodes {
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

export default AlbumTemplate;
