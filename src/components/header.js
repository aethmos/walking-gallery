import React, {useEffect, useRef} from "react";
import styles from "./header.module.scss";
import {Link} from "gatsby";
import {Icon} from "@iconify/react";
import home from "@iconify/icons-mdi-light/home";
import activatedSensor from "@iconify/icons-mdi-light/eye";
import suspendedSensor from "@iconify/icons-mdi-light/eye-off";
import PropTypes from "prop-types";

const Header = ({showHomeButton, title, sensorActive, setSensorActive, debugPanelActive, setDebugPanelActive}) => {
    const sensorBtn = useRef();
    const titleBtn = useRef();

    useEffect(() => {
        const button = sensorBtn.current;
        const title = titleBtn.current;
        button.addEventListener('click', _ => {
            setSensorActive(!sensorActive);
        });
        title.addEventListener('click', _ => {
            setDebugPanelActive(!debugPanelActive);
        });
        return () => {
            button.removeEventListener('click', _ => {
                setSensorActive(!sensorActive);
            });
            title.removeEventListener('click', _ => {
                setDebugPanelActive(!debugPanelActive);
            });
        }
    });

    return <div className={styles.header}>
        <div className={styles.backBtn} style={{opacity: showHomeButton ? 1 : 0}}><Link to='/'><Icon icon={home}/></Link></div>
        <div className={styles.title} ref={titleBtn}><h1>{title}</h1></div>
        <div className={styles.suspendBtn} ref={sensorBtn}><Icon icon={sensorActive ? activatedSensor : suspendedSensor}/></div>
    </div>;
};

Header.propTypes = {
    title: PropTypes.any,
    meta: PropTypes.any
};

export default Header;
