import React from 'react';
import Layout from '../components/layout';
import ImageCarousel from "../components/ImageCarousel";
import {graphql} from "gatsby";

const ImageGalleryTemplate = ({data: {category, images}}) => {
    images = images.edges.map(edge => {
        let image = edge.node;
        image.category = category;
        return image;
    });
    category.totalImages = images.length;
    return (
        <Layout>
            <ImageCarousel images={images}/>
        </Layout>
    );
};

export const query = graphql`
            query CategoriesAndThumbnails{
                category: collectionsJson(relativeDirectory: { eq: $path}) {
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

export default ImageGalleryTemplate;
