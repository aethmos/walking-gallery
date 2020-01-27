import React, {useEffect} from "react";
import BackgroundImage from "gatsby-background-image";
import Proptypes from "prop-types";
import {useMotionValue} from "framer-motion";
import {Link} from "gatsby";
import styles from "./Slider.module.scss";

const Slide = ({content, index, slider}) => {
    const [offset, setOffset] = useMotionValue(0);

    useEffect(() => {

    });

    const MainContent = (
      <>
        <BackgroundImage className={styles.image}
                                 fluid={content.image.childImageSharp.fluid}
                                 data-index={index} data-active={index === slider.state.currentIndex}/>
        {!content.text ? null :
        <div className={styles.panel}
             data-index={index} data-active={index === slider.state.currentIndex}>
            <h3>{content.text}</h3>
        </div>}
      </>
    );

    return content.link ? (
        <motion.div className={styles.slide}>
            <Link to={content.link}>
                <MainContent/>
            </Link>
        </motion.div>
    ) : (
        <motion.div className={styles.slide}>
            <MainContent/>
        </motion.div>
    )
};

Slide.Proptypes = {
    content: Proptypes.shape({
        image: Proptypes.node.isRequired,
        text: Proptypes.string
    }),
    index: Proptypes.number,
    currentIndex: Proptypes.number,
};

export default Slide;
