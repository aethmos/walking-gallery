import React from 'react';
import Slider from "infinite-react-carousel"
import styles from "./Carousel.module.scss";

function DefaultSlider({settings = {}, children}) {
    const finalSettings = {
        adaptiveHeight: false,
        arrowsBlock: false,
        className: styles.carousel,
        duration: 100,
        wheel: true,
        ...settings
    };

    return (
        <Slider {...finalSettings}>
            {children}
        </Slider>
    );
}

export default DefaultSlider;
