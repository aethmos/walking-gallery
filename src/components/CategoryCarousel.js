import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BackgroundImage from "gatsby-background-image";
import styles from "./Carousel.module.scss";
import Slider from "infinite-react-carousel";
import {Link} from "gatsby";

class CategoryCarousel extends Component {
    render() {
        let {categories, thumbnails} = this.props;
        const settings = {
            adaptiveHeight: false,
            arrowsBlock: false,
            className: styles.carousel,
            duration: 100,
            wheel: true
        };

        let cats = [];
        for (let j = 0; j < categories.length; j++) {
            for (let i = 0; i < thumbnails.length; i++) {
                let image = thumbnails[i];
                if (image.relativeDirectory === categories[j].relativeDirectory) {
                    cats.push({...categories[j], thumbnail: {...image}});
                    break;
                }
            }
        }

        return (
            <Slider {...settings}>{ cats.map((value, index) => (
                <Link to={'/' + value.relativeDirectory + '/'}>
                    <BackgroundImage className={styles.slide} fluid={value.thumbnail.childImageSharp.fluid}>
                        <div className={styles.descriptionPanel}>
                            <h3>{index + 1} - {value.title}</h3>
                            {/*<span>{value.date}</span>*/}
                        </div>
                    </BackgroundImage>
                </Link>
            )) }</Slider>
        )
    }
}

CategoryCarousel.propTypes = {
    categories: PropTypes.array,
    thumbnails: PropTypes.array
};

export default CategoryCarousel;
