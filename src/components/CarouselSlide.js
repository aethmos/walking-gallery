import React, {Component} from "react";
import * as PropTypes from "prop-types";
import BackgroundImage from 'gatsby-background-image'

import styles from './CarouselSlide.module.scss'

class CarouselSlide extends Component {
    render() {
        let {title, path, index} = this.props;
        return (
            <BackgroundImage className={styles.slide} sources={{path}}>
                <div className={styles.descriptionPanel}>
                    <h3>{index} - {title}</h3>
                </div>
            </BackgroundImage>
        )
    }
}

CarouselSlide.propTypes = {
    title: PropTypes.string,
    path: PropTypes.string,
    index: PropTypes.number
};

CarouselSlide.defaultProps = {title: 'Test Title', index: 0};

export default  CarouselSlide;
