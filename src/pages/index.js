import React from 'react';
import Layout from '../components/layout';
import {graphql, Link} from "gatsby";
import styles from "../components/Carousel.module.scss";
import Slider from "infinite-react-carousel";
import BackgroundImage from "gatsby-background-image";

const IndexPage = ({data: { categories, imagesByCategory }}) => {
    categories = categories.nodes.map(category => {
        category.link = category.relativeDirectory;
        let images = imagesByCategory
            .group
            .filter(group => group.edges[0].node.relativeDirectory === category.relativeDirectory)[0]
            .edges
            .map(edge => edge.node);
        category.totalImages = images.length;
        category.thumbnail = images[category.thumbIdx];
        return category;
    }).filter(category => category.thumbnail !== undefined);

    const settings = {
        adaptiveHeight: false,
        arrowsBlock: false,
        className: styles.carousel,
        duration: 100,
        wheel: true
    };

    return (
        <Layout>
            <Slider {...settings}>{ categories.map((value, index) => (
                <Link to={'/' + value.relativeDirectory + '/'}>
                    <BackgroundImage className={styles.slide} fluid={value.thumbnail.childImageSharp.fluid}>
                        <div className={styles.descriptionPanel}>
                            <h3>{index + 1} - {value.title}</h3>
                            {/*<span>{value.date}</span>*/}
                        </div>
                    </BackgroundImage>
                </Link>
            )) }</Slider>
        </Layout>
    );
};

export const query = graphql`
            query CategoriesAndImages{
                categories: allCategoryJson {
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
