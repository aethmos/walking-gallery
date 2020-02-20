import React from "react";
import styles from "./header.module.scss";
import {Link} from "gatsby";
import {Icon} from "@iconify/react";
import home from "@iconify/icons-mdi-light/arrow-left";
import activatedSensor from "@iconify/icons-mdi-light/sim";
import suspendedSensor from "@iconify/icons-mdi-light/sim-off";
import PropTypes from "prop-types";

const Header = ({showHomeButton, title, sensorActive, setSensorActive, debugPanelActive, setDebugPanelActive}) => {
    function toggleSensorActive(_) {
        setSensorActive(!sensorActive);
    }

    function toggleDebugPanelActive(_) {
        setDebugPanelActive(!debugPanelActive);
    }

    return <nav className={styles.header}>
        <button className={styles.backBtn + ' button'} style={{opacity: showHomeButton ? 1 : 0}}><Link to='/' aria-disabled={!showHomeButton}><Icon icon={home}/></Link></button>
        <div className={styles.title} onClick={toggleDebugPanelActive}><h1>{title}</h1></div>
        <button className={styles.suspendBtn + ' button'} onClick={toggleSensorActive}><Icon icon={sensorActive ? activatedSensor : suspendedSensor}/></button>
    </nav>;
};

Header.propTypes = {
    title: PropTypes.any,
    meta: PropTypes.any
};

export default Header;
