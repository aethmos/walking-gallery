import React, {Component} from 'react';
import Slider from 'infinite-react-carousel';
import * as PropTypes from "prop-types";
import styles from './Carousel.module.scss'
import BackgroundImage from "gatsby-background-image";

class Carousel extends Component {
  render() {
    let { images} = this.props;
    const settings = {
      adaptiveHeight: false,
      arrowsBlock: false,
      className: styles.carousel,
      duration: 100,
      wheel: true
    };
    return (
        <Slider {...settings}>{ images.map((item, index) => (
            <BackgroundImage key={item.id} className={styles.slide} fluid={item.childImageSharp.fluid}>
                { item.category?.title === undefined ? '' : (
                    <div className={styles.descriptionPanel}>
                        <h3>{index + 1} - {item.category.title}</h3>
                    </div>
                ) }
            </BackgroundImage>
        )) }</Slider>
    );
  }
}

Carousel.propTypes = {
  images: PropTypes.array.isRequired
};

export default Carousel;
