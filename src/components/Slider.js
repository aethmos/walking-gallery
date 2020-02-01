import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./Slider.module.scss";
import Slide from "./Slide";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import Accelerometer from "./Accelerometer";
import {wrap} from "@popmotion/popcorn";

let sensorCooldown;
const cooldownMilliseconds = 1000;  // adjust to fit slide animation duration
const stepInOutThreshold = 50;  // adjust to fit slide animation duration
const turnSlideThreshold = 30;  // adjust to fit slide animation duration

const Slider = ({
                    className = styles.slider,
                    initialIndex,
                    sections,
                    insideSection = true,
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

    const enterCurrentSection = useCallback(() => {
        if (sections[currentIndex].link)
            window.location.replace(sections[currentIndex].link);
    }, [sections, currentIndex]);
    const navigateHome = useCallback(() => {
        window.location.replace('/');
    }, []);

    // navigation: step in/out
    useEffect(() => {
        if (listening && sensorActive) {
            clearTimeout(sensorCooldown);
            setListening(false);

            if ((!insideSection) && (acceleration.stepInOut < -(stepInOutThreshold))) {
                sensorCooldown = setTimeout(() => setListening(true), cooldownMilliseconds);

                // enterCurrentSection();

                console.log('go to current section with acceleration values:');
                console.log(acceleration);

            } else if ((insideSection) && (acceleration.stepInOut > (stepInOutThreshold))) {
                sensorCooldown = setTimeout(() => setListening(true), cooldownMilliseconds);

                // navigateHome();

                console.log('go to homepage with acceleration values:');
                console.log(acceleration);

            } else {
                setListening(true);
            }
        }
    }, [acceleration, listening, sensorActive, enterCurrentSection, navigateHome, insideSection]);

    // navigation: turn left/right
    useEffect(() => {
        if (listening && sensorActive) {
            clearTimeout(sensorCooldown);
            setListening(false);

            // next or previous slide
            // beta (turning in vertical position) / gamma (turning in flat position)
            if (rotation.turning < -(turnSlideThreshold)) {
                sensorCooldown = setTimeout(() => setListening(true), cooldownMilliseconds);

                nextSlide();

                console.log('go to next slide with rotation values:');
                console.log(rotation);

            } else if (rotation.turning > (turnSlideThreshold)) {
                sensorCooldown = setTimeout(() => setListening(true), cooldownMilliseconds);

                prevSlide();

                console.log('go to previous slide with rotation values:');
                console.log(rotation);
            } else {
                setListening(true);
            }
        }
    }, [rotation, listening, sensorActive, prevSlide, nextSlide]);

    // keyboard and mouse navigation
    useEffect(() => {
        function navigateKey(event) {
            // escape
            if (event.keyCode === 27) {
                navigateHome();
            }
            // enter
            if (event.keyCode === 13) {
                enterCurrentSection();
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
    }, [currentIndex, sections, prevSlide, nextSlide, enterCurrentSection, navigateHome]);

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

const SensorSlider = ({sensorActive = true, ...props}) => (
    <Accelerometer sensorActive={sensorActive} multiplier={10}>
        {(acceleration, rotation) => (
            <Slider {...props} acceleration={acceleration} rotation={rotation} sensorActive={sensorActive}/>
        )}
    </Accelerometer>
);

export default SensorSlider;
