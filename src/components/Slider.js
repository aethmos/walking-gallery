import React, {useEffect, useRef, useState} from 'react';
import styles from "./Slider.module.scss";
import Slide from "./Slide";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import Accelerometer from "./Accelerometer";
import {wrap} from "@popmotion/popcorn";

const Slider = ({
                    className = styles.slider,
                    initialIndex,
                    sections,
                    sensorActive
                }) => {

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    const totalSlides = sections.length;
    const leftArrowElement = useRef();
    const rightArrowElement = useRef();

    function wrapped(number) {
        return wrap(0, totalSlides - 1, number)
    }

    function prevSlide(event) {
        setCurrentIndex(wrapped(currentIndex - 1));
    }

    function nextSlide(event) {
        setCurrentIndex(wrapped(currentIndex + 1));
    }

    function navigateKey(event) {
        console.log(event.keyCode);
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

    useEffect(() => {
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
    });

    return (
        <Accelerometer>
            {(acceleration, rotation) => (
                <div className={className}>
                    <div className={`${styles.arrows} ${styles.left}`} ref={leftArrowElement}><Icon icon={leftArrow}/></div>
                    <div className={`${styles.arrows} ${styles.right}`} ref={rightArrowElement}><Icon icon={rightArrow}/></div>
                    {sections.map((content, index) => {
                        return <Slide index={index} useIndex={[currentIndex, setCurrentIndex]} totalSlides={totalSlides} content={content} acceleration={acceleration} sensorActive={sensorActive}/>
                    })}
                </div>
            )}
        </Accelerometer>
    )
};

export default Slider;
