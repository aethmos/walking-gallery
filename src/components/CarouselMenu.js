import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BackgroundImage from "gatsby-background-image";
import styles from "./Carousel.module.scss";
import Slider from "infinite-react-carousel";
import {Link} from "gatsby";

class CarouselMenu extends Component {
    render() {
        let {categories} = this.props;
        const settings = {
            adaptiveHeight: false,
            arrowsBlock: false,
            className: styles.carousel,
            duration: 100,
            wheel: true
        };
        return (
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
        )
    }
}

CarouselMenu.propTypes = {
    categories: PropTypes.array.isRequired
};

export default CarouselMenu;
