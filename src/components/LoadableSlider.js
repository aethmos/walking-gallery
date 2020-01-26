import Loadable from "react-loadable";
import React from "react";
import styles from './Carousel.module.scss';
import Icon from "@iconify/react";
import loader from '@iconify/icons-mdi-light/loading';

function Loading(props) {
    return props.error ? (
        <div className={styles.carouselLoader}>Error! <button onClick={props.retry}>Retry</button></div>) : (
        <div className={styles.carouselLoader}><Icon icon={loader}/><span>loading</span></div>);
}

const LoadableSlider = Loadable({
    loader: () => import('../components/Slider'),
    loading: Loading
});

export default LoadableSlider;
