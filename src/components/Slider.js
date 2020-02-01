import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./Slider.module.scss";
import Slide from "./Slide";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import Accelerometer from "./Accelerometer";
import {wrap} from "@popmotion/popcorn";

let cooldownPeriod;
const cooldownMilliseconds = 400;  // adjust to fit slide animation duration

const Slider = ({
                    className = styles.slider,
                    initialIndex,
                    sections,
                    sensorActive,
                    acceleration,
                    rotation
                }) => {

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    const totalSlides = sections.length;

    const leftArrowElement = useRef();
    const rightArrowElement = useRef();

    const [listening, setListening] = useState(true);

    const wrapped = useCallback(number => wrap(0, totalSlides - 1, number), [totalSlides]);
    const nextSlide = useCallback(() => setCurrentIndex(wrapped(currentIndex + 1)), [setCurrentIndex, currentIndex, wrapped]);
    const prevSlide = useCallback(() => setCurrentIndex(wrapped(currentIndex - 1)), [setCurrentIndex, currentIndex, wrapped]);

    // gesture navigation
    useEffect(() => {
        if (listening && sensorActive) {
            if (acceleration.x > 10) {
                nextSlide();
                clearTimeout(cooldownPeriod);
                setListening(false);
            } else if (acceleration.x < -10) {
                prevSlide();
                clearTimeout(cooldownPeriod);
                setListening(false);
            }
            cooldownPeriod = setTimeout(() => setListening(true), cooldownMilliseconds)
        }
    }, [acceleration, listening, sensorActive, prevSlide, nextSlide]);

    // keyboard and mouse navigation
    useEffect(() => {
        function navigateKey(event) {
            // escape
            if (event.keyCode === 27) {
                window.location.replace('/');
            }
            // enter
            if (event.keyCode === 13) {
                if (sections[currentIndex].link)
                    window.location.replace(sections[currentIndex].link);
            }
            // left arrow
            if (event.keyCode === 37) {
                prevSlide();
            }
            // right arrow
            else if (event.keyCode === 39) {
                nextSlide();
            }
        }

        const left = leftArrowElement.current;
        const right = rightArrowElement.current;
        left.addEventListener('click', prevSlide);
        right.addEventListener('click', nextSlide);
        document.addEventListener('keydown', navigateKey);
        return () => {
            left.removeEventListener('click', prevSlide);
            right.removeEventListener('click', nextSlide);
            document.removeEventListener('keydown', navigateKey);
        }
    }, [currentIndex, sections, prevSlide, nextSlide]);

    return (
        <div className={className}>
            {/* navigation arrows */}
            <div className={`${styles.arrows} ${styles.left}`} ref={leftArrowElement}><Icon icon={leftArrow}/></div>
            <div className={`${styles.arrows} ${styles.right}`} ref={rightArrowElement}><Icon icon={rightArrow}/></div>

            {/* slides */}
            {sections.map((content, index) => {
                return <Slide index={index} useIndex={[currentIndex, setCurrentIndex]} totalSlides={totalSlides} content={content} acceleration={acceleration} sensorActive={sensorActive}/>
            })}
        </div>
    )
};

const SensorSlider = (props) => (
    <Accelerometer>
        {(acceleration, rotation) => (
            <Slider {...props} acceleration={acceleration} rotation={rotation}/>
        )}
    </Accelerometer>
);

export default SensorSlider;
