import React from 'react';
import Layout from '../components/layout';
import {graphql, Link} from "gatsby";
import styles from "./Carousel.module.scss";
import Slider from "infinite-react-carousel";
import BackgroundImage from "gatsby-background-image";

const AlbumTemplate = ({data: {category, images}}) => {
    images = images.edges.map(edge => {
        let image = edge.node;
        image.category = category;
        image.link = '/';
        return image;
    });
    category.totalImages = images.length;

    const settings = {
      adaptiveHeight: false,
      arrowsBlock: false,
      className: styles.carousel,
      duration: 100,
      wheel: true,
      initialSlide: category.thumbIdx
    };
    return (
        <Layout title={category.title}>
            <Slider {...settings}>{ images.map((image, index) => (
                <Link to={image.link ? image.link : '#'}>
                    <BackgroundImage key={image.id} className={styles.slide} fluid={image.childImageSharp.fluid}>
                        { image.category?.title === undefined ? '' : (
                            <div className={styles.descriptionPanel}>
                                <h3>{index + 1} / {image.category.totalImages}</h3>
                            </div>
                        ) }
                    </BackgroundImage>
                </Link>
            )) }</Slider>
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
