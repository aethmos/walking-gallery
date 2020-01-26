import React from 'react';
import Layout from '../components/layout';
import {graphql, Link} from "gatsby";
import styles from "../components/Slider.module.scss";
import BackgroundImage from "gatsby-background-image";
import Slider from "../components/Slider";

const IndexPage = ({data}) => {
    let categories = data.categories.nodes.map(category => {
        category.link = category.relativeDirectory;
        let images = data.imagesByCategory
            .group
            .filter(group => group.edges[0].node.relativeDirectory === category.relativeDirectory)[0]
            .edges
            .map(edge => edge.node);
        category.totalImages = images.length;
        category.thumbnail = images[category.thumbIdx];
        return category;
    }).filter(category => category.thumbnail !== undefined);

    return (
        <Layout title={'' + data.categories.totalCount + ' Collections'} image={categories[0].thumbnail.childImageSharp.fluid.src} showHomeButton={false}>
            <Slider>{ categories.map((value, index) => (
                <Link to={'/' + value.relativeDirectory + '/'}>
                    <BackgroundImage className={styles.slide} fluid={value.thumbnail.childImageSharp.fluid}>
                        <div className={styles.descriptionPanel}>
                            <h3>{value.title}</h3>
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
