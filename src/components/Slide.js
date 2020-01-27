import React, {useEffect} from "react";
import BackgroundImage from "gatsby-background-image";
import {useMotionValue, motion} from "framer-motion";
import {Link} from "gatsby";
import styles from "./Slider.module.scss";

const AutoLink = ({to, children}) => {
    return to ? <Link to={to}>{children}</Link> : <>{children}</>
};

const Slide = ({content, index, totalSlides, active}) => {
    const offset = useMotionValue(0);

    useEffect(() => {

    });

    return (
        <motion.div className={styles.slide}>
            <AutoLink to={content.link}>
                <BackgroundImage className={styles.image}
                             fluid={content.image.childImageSharp.fluid}
                             data-index={index} data-active={active}/>
            </AutoLink>

            {!content.text ? null :
            <div className={styles.panel}
                 data-index={index} data-active={active}>
                <h3>{content.text}</h3>
            </div>}
        </motion.div>
    )
};

export default Slide;
