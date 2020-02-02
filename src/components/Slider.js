import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./Slider.module.scss";
import Slide from "./Slide";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import Accelerometer from "./Accelerometer";
import {wrap} from "@popmotion/popcorn";

let turnSlideCooldown;
const turnSlideThreshold = 50;
const turnSlideCooldownMilliseconds = 1000;

let stepInOutCooldown;
const stepInOutThreshold = 5;
const stepInOutCooldownMilliseconds = 3000;

const Slider = ({
                    className = styles.slider,
                    initialIndex,
                    sections,
                    insideSection = true,
                    sensorActive,
                    acceleration,
                    rotation,
                    debugPanelActive
                }) => {

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    const [alert, setAlert] = useState('initial');
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
            clearTimeout(stepInOutCooldown);
            setListening(false);

            if ((!insideSection) && (acceleration.stepInOut > (stepInOutThreshold))) {
                stepInOutCooldown = setTimeout(() => setListening(true), stepInOutCooldownMilliseconds);

                // enterCurrentSection();

                console.log('go to current section with acceleration values:');
                console.log(acceleration);
                setAlert('go to current section');

            } else if ((insideSection) && (acceleration.stepInOut < -(stepInOutThreshold))) {
                stepInOutCooldown = setTimeout(() => setListening(true), stepInOutCooldownMilliseconds);

                // navigateHome();

                console.log('go to homepage with acceleration values:');
                console.log(acceleration);
                setAlert('go to homepage');

            } else {
                setListening(true);
            }
        }
    }, [acceleration, listening, sensorActive, enterCurrentSection, navigateHome, insideSection]);

    // navigation: turn left/right
    useEffect(() => {
        if (listening && sensorActive) {
            clearTimeout(turnSlideCooldown);
            setListening(false);

            // next or previous slide
            // beta (turning in vertical position) / gamma (turning in flat position)
            if (rotation.turning < -(turnSlideThreshold)) {
                turnSlideCooldown = setTimeout(() => setListening(true), turnSlideCooldownMilliseconds);

                nextSlide();

                console.log('go to next slide with rotation values:');
                console.log(rotation);
                setAlert('go to next slide');

            } else if (rotation.turning > (turnSlideThreshold)) {
                turnSlideCooldown = setTimeout(() => setListening(true), turnSlideCooldownMilliseconds);

                prevSlide();

                console.log('go to previous slide with rotation values:');
                console.log(rotation);
                setAlert('go to previous slide');
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

            <div className={`${styles.debug}${debugPanelActive ? '' : ` ${styles.hidden}`}`}>
                <h3>{alert}</h3>
                <h4>Acceleration</h4>
                <p>
                    <span>x: {Math.floor(acceleration.x * 1000) / 1000}</span><br/>
                    <span>y: {Math.floor(acceleration.y * 1000) / 1000}</span><br/>
                    <span>z: {Math.floor(acceleration.z * 1000) / 1000}</span><br/>
                    <span>distX: {Math.floor(acceleration.distanceX * 1000) / 1000}</span><br/>
                    <span>distY: {Math.floor(acceleration.distanceY * 1000) / 1000}</span><br/>
                    <span>distZ: {Math.floor(acceleration.distanceZ * 1000) / 1000}</span><br/>
                    <span>stepping: {Math.floor(acceleration.stepInOut * 1000) / 1000} / {stepInOutThreshold}</span><br/>
                </p>
                <h4>Rotation</h4>
                <p>
                    <span>alpha: {Math.floor(rotation.alpha * 1000) / 1000}</span><br/>
                    <span>beta: {Math.floor(rotation.beta * 1000) / 1000}</span><br/>
                    <span>gamma: {Math.floor(rotation.gamma * 1000) / 1000}</span><br/>
                    <span>turning: {Math.floor(rotation.turning * 1000) / 1000} / {turnSlideThreshold}</span><br/>
                    {/*<span>x: {rotation.x || ''}</span><br/>*/}
                    {/*<span>y: {rotation.y || ''}</span><br/>*/}
                    {/*<span>z: {rotation.z || ''}</span><br/>*/}
                </p>
            </div>

            {/* slides */}
            {sections.map((content, index) => {
                return <Slide index={index} useIndex={[currentIndex, setCurrentIndex]} totalSlides={totalSlides} content={content} acceleration={acceleration} sensorActive={sensorActive}/>
            })}
        </div>
    )
};

const SensorSlider = ({sensorActive = true, ...props}) => (
    <Accelerometer sensorActive={sensorActive} multiplier={50}>
        {(acceleration, rotation) => (
            <Slider {...props} acceleration={acceleration} rotation={rotation} sensorActive={sensorActive}/>
        )}
    </Accelerometer>
);

export default SensorSlider;
