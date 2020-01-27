import React, {useEffect} from "react";
import BackgroundImage from "gatsby-background-image";
import {useMotionValue, motion} from "framer-motion";
import {Link} from "gatsby";
import styles from "./Slider.module.scss";

const Slide = ({content, index, active}) => {
    const [offset, setOffset] = useMotionValue(0);

    useEffect(() => {

    });

    return content.link ? (
        <motion.div className={styles.slide}>
            <Link to={content.link}>
                <BackgroundImage className={styles.image}
                             fluid={content.image.childImageSharp.fluid}
                             data-index={index} data-active={active}/>
            </Link>

            {!content.text ? null :
            <div className={styles.panel}
                 data-index={index} data-active={active}>
                <h3>{content.text}</h3>
            </div>}
        </motion.div>
    ) : (
        <motion.div className={styles.slide}>
            <BackgroundImage className={styles.image}
                             fluid={content.image.childImageSharp.fluid}
                             data-index={index} data-active={active}/>

            {!content.text ? null :
            <div className={styles.panel}
                 data-index={index} data-active={active}>
                <h3>{content.text}</h3>
            </div>}
        </motion.div>
    )
};

export default Slide;
