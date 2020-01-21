import React, {Component} from 'react';
import Slider from 'infinite-react-carousel';
import * as PropTypes from "prop-types";
import CarouselSlide from './CarouselSlide';
import styles from './Carousel.module.scss'

class Carousel extends Component {
  render() {
    let {className, items} = this.props;
    const settings = {
      adaptiveHeight: true,
      arrowsBlock: false,
      className: className,
      duration: 100,
      wheel: true
    };
    return (
      <Slider {...settings}>
        {
            items.map(props => CarouselSlide(props))
        }
      </Slider>
    );
  }
}

Carousel.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array
};

Carousel.defaultProps = {className: styles.carousel, items: {}};

export default Carousel;
