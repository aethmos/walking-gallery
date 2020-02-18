import React, {useCallback, useEffect, useState} from "react";
import BackgroundImage from "gatsby-background-image";
import {useMotionValue, motion} from "framer-motion";
import {wrap} from "@popmotion/popcorn";
import {Link} from "gatsby";
import styles from "./slider.module.scss";

const AutoLink = ({to, children}) => {
    return to ? <Link to={to}>{children}</Link> : <>{children}</>
};

const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

const variants = {
    left: (deviceWidth) => ({
        x: -deviceWidth,
        opacity: 0,
        scale: 0.6,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 0.9,
    },
    right: (deviceWidth) => ({
        zIndex: 0,
        x: deviceWidth,
        opacity: 0,
        scale: 0.6,
    })
};

const SliderSection = ({content, index, totalSlides, useIndex}) => {
    const [currentIndex, setCurrentIndex] = useIndex;
    const [inView, setInView] = useState(currentIndex === index);
    const [deviceWidth, setDeviceWidth] = useState(1000);
    const [variant, setVariant] = useState('center');
    const x = useMotionValue(0);
    const wrapped = useCallback(number => wrap(0, totalSlides - 1, number), [totalSlides]);

    useEffect(() => {
        setDeviceWidth(window.innerWidth);
        window.addEventListener('resize', () => setDeviceWidth(window.innerWidth));
        return () => {
            window.removeEventListener('resize', () => setDeviceWidth(window.innerWidth));
        }
    }, [deviceWidth]);

    useEffect(() => {

        if (index === currentIndex) {
            setInView(true);
            setVariant('center');

        } else {
            setInView(false);
            setVariant(index === wrapped(currentIndex - 1) ? 'left' : 'right');
        }
    }, [currentIndex, index, wrapped]);

    return (
        <motion.div className={styles.slide}
                    animate={variant}
                    variants={variants}
                    custom={deviceWidth}
                    transition={{
                        x: {type: "spring", stiffness: 300, damping: 200},
                        opacity: {duration: 0.2},
                        scale: {duration: 0.2}
                    }}
                    style={{x}}
                    drag={"x"}
                    dragConstraints={{left: 0, right: 0}}
                    dragElastic={1}
                    onDragEnd={(e, {offset, velocity}) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -10000) {
                            setCurrentIndex(index => wrapped(index + 1));
                        } else if (swipe > 10000) {
                            setCurrentIndex(index => wrapped(index - 1));
                        }
                    }}>
            <AutoLink to={content.link}>
                <BackgroundImage className={styles.image}
                                 fluid={content.image.childImageSharp.fluid}
                                 data-index={index} data-active={inView}/>
            </AutoLink>

            {!content.text ? null :
                <div className={styles.panel}
                     data-index={index} data-active={inView}>
                    <h3>{content.text}</h3>
                </div>}
        </motion.div>
    )
};

export default SliderSection;
