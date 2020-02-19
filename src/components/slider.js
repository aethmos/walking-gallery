import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./slider.module.scss";
import SliderSection from "./sliderSection";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import SensorProvider from "./sensorProvider";
import {wrap} from "@popmotion/popcorn";

const stepInThreshold = 15;
const stepOutThreshold = 20;
const stepInOutBufferMax = 15;
const stepInOutBufferMin = 10;
const stepInOutCooldownMilliseconds = 3000;
const stepInOutDeadlineMilliseconds = 3000;
let stepInOutCooldown;
let stepInOutDeadline;
let steppingIn = false;
let steppingOut = false;

const turningThreshold = 35;
const turningBufferMax = 15;
const turningBufferMin = 10;
const turningCooldownMilliseconds = 1000;
let turningCooldown;

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

    const [stepInOutEvents, setStepInOutEvents] = useState([]);
    const [stepInOutAvg, setStepInOutAvg] = useState(0);
    const [turningEvents, setTurningEvents] = useState([]);
    const [turningAvg, setTurningAvg] = useState(0);

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    const [alert, setAlert] = useState('initial');
    const totalSlides = sections.length;

    const leftArrowElement = useRef();
    const rightArrowElement = useRef();

    const [listeningToTurning, setListeningToTurning] = useState(true);
    const [listeningToStepping, setListeningToStepping] = useState(true);

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
    const handleStepInOutAvg = useCallback((stepInOutValue) => {
        setListeningToStepping(false);
        setStepInOutAvg(stepInOutValue);

        // detect step forwards
        if (!insideSection) {
            // deceleration
            if (steppingIn && stepInOutValue < -stepOutThreshold) {
                clearTimeout(stepInOutDeadline);
                steppingIn = false;
                stepInOutCooldown = setTimeout(() => setListeningToStepping(true), stepInOutCooldownMilliseconds);

                enterCurrentSection();

                console.log('go to current section with acceleration values:');
                console.log(acceleration);
                setAlert('go to current section');
                return;
            }
            // acceleration forwards
            else if (stepInOutValue > stepInThreshold) {
                steppingIn = true;
                stepInOutDeadline = setTimeout(() => steppingIn = false, stepInOutDeadlineMilliseconds);
            }

        // detect step backwards
        } else {
            // deceleration
            if (steppingOut && stepInOutValue > stepOutThreshold) {
                clearTimeout(stepInOutDeadline);
                steppingOut = false;
                stepInOutCooldown = setTimeout(() => setListeningToStepping(true), stepInOutCooldownMilliseconds);

                navigateHome();

                console.log('go to homepage with acceleration values:');
                console.log(acceleration);
                setAlert('go to homepage');
                return;
            }
            // acceleration backwards
            else if (stepInOutValue < -stepInThreshold) {
                steppingOut = true;
                stepInOutDeadline = setTimeout(() => steppingOut = false, stepInOutDeadlineMilliseconds);
            }
        }
        setListeningToStepping(true);
    });

    // step in/out average calculation and event queue rollover
    useEffect(() => {
        if (listeningToStepping && sensorActive) {
            clearTimeout(stepInOutCooldown);

            const stepInOut = acceleration.stepInOut;
            const queue = [stepInOut, ...stepInOutEvents.slice(0, stepInOutBufferMax)];

            if (queue.length >= stepInOutBufferMin) {
                handleStepInOutAvg(queue.reduce((a, b) => a + b) / queue.length);
                setStepInOutEvents([]);
            } else {
                setStepInOutEvents(queue);
            }
        }
    }, [acceleration, listeningToStepping, sensorActive, setStepInOutAvg]);

    // navigation: turn left/right
    const handleTurningAvg = useCallback((turningValue) => {
        setListeningToTurning(false);
        setTurningAvg(turningValue);
        // next or previous slide
        if (turningValue < -(turningThreshold)) {
            turningCooldown = setTimeout(() => setListeningToTurning(true), turningCooldownMilliseconds);

            nextSlide();

            console.log('go to next slide with rotation values:');
            console.log(rotation);
            setAlert('go to next slide');

        } else if (turningValue > (turningThreshold)) {
            turningCooldown = setTimeout(() => setListeningToTurning(true), turningCooldownMilliseconds);

            prevSlide();

            console.log('go to previous slide with rotation values:');
            console.log(rotation);
            setAlert('go to previous slide');
        } else setListeningToTurning(true);
    });

    // turning average calculation and event queue rollover
    useEffect(() => {
        if (listeningToTurning && sensorActive) {
            clearTimeout(turningCooldown);

            const queue = [rotation, ...turningEvents.slice(0, turningBufferMax)];

            if (queue.length >= turningBufferMin) {
                handleTurningAvg(queue.map(event => event.turning).reduce((a, b) => a + b) / queue.length);
                setTurningEvents([]);
            } else {
                setTurningEvents(queue);
            }
        }
    }, [rotation, listeningToTurning, sensorActive]);

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
            <nav className={`${styles.arrows} ${styles.left}`} ref={leftArrowElement}><Icon icon={leftArrow}/></nav>
            <nav className={`${styles.arrows} ${styles.right}`} ref={rightArrowElement}><Icon icon={rightArrow}/></nav>

            {/* debug panel */}
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
                    <span>stepping: {Math.floor(stepInOutAvg * 1000) / 1000} / {stepInThreshold} >> {stepOutThreshold}</span><br/>
                </p>
                <h4>Rotation</h4>
                <p>
                    <span>alpha: {Math.floor(rotation.alpha * 1000) / 1000}</span><br/>
                    <span>beta: {Math.floor(rotation.beta * 1000) / 1000}</span><br/>
                    <span>gamma: {Math.floor(rotation.gamma * 1000) / 1000}</span><br/>
                    <span>turning: {Math.floor(turningAvg * 1000) / 1000} / {turningThreshold}</span><br/>
                    {/*<span>x: {rotation.x || ''}</span><br/>*/}
                    {/*<span>y: {rotation.y || ''}</span><br/>*/}
                    {/*<span>z: {rotation.z || ''}</span><br/>*/}
                </p>
            </div>

            {/* slides */}
            {sections.map((content, index) => {
                return <SliderSection index={index} useIndex={[currentIndex, setCurrentIndex]} totalSlides={totalSlides} content={content} acceleration={acceleration} sensorActive={sensorActive}/>
            })}
        </div>
    )
};

const SensorSlider = ({sensorActive = true, ...props}) => (
    <SensorProvider sensorActive={sensorActive} multiplier={50}>
        {(acceleration, rotation) => (
            <Slider {...props} acceleration={acceleration} rotation={rotation} sensorActive={sensorActive}/>
        )}
    </SensorProvider>
);

export default SensorSlider;
