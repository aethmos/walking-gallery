import React, {useState} from 'react';
import styles from "./Slider.module.scss";
import Slide from "./Slide";
import Icon from "@iconify/react";
import leftArrow from "@iconify/icons-mdi-light/chevron-left";
import rightArrow from "@iconify/icons-mdi-light/chevron-right";
import Accelerometer from "./Accelerometer";

const Slider = ({
        className = styles.slider,
        initialIndex,
        sections
    }) => {

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

    return (
        <Accelerometer>
            {(acceleration, rotation) => (
                <div className={className}>
                    <div className={`${styles.arrows} ${styles.left}`}><Icon icon={leftArrow}/></div>
                    <div className={`${styles.arrows} ${styles.right}`}><Icon icon={rightArrow}/></div>
                    {sections.map((content, index) => {
                        return <Slide index={index} currentIndex={currentIndex} totalSlides={sections.length} content={content}/>
                    })}
                </div>
            )}
        </Accelerometer>
    )
};

export default Slider;
