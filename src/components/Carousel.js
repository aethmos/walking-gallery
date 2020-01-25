import React, {Component} from 'react';
import Slider from 'infinite-react-carousel';
import * as PropTypes from "prop-types";
import styles from './Carousel.module.scss'
import BackgroundImage from "gatsby-background-image";

class Carousel extends Component {
  render() {
    let { className, items} = this.props;
    const settings = {
      adaptiveHeight: false,
      arrowsBlock: false,
      className: className,
      duration: 100,
      wheel: true
    };
    return (
        <Slider {...settings}>{ items.map(item => (
            <BackgroundImage key={item.image.id} className={styles.slide} fluid={item.image.childImageSharp.fluid}>
                { item.title === undefined ? '' : (
                    <div className={styles.descriptionPanel}>
                        <h3>{item.index + 1} - {item.title}</h3>
                    </div>
                ) }
            </BackgroundImage>
        )) }</Slider>
    );
  }
}

Carousel.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array
};

Carousel.defaultProps = {className: styles.carousel, items: {}};

export default Carousel;
