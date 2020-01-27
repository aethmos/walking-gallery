import React, {useEffect, useState} from "react";

const Accelerometer = (props) => {
    const {useGravity = false, multiplier = 1, children } = props;
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [landscape, setLandscape] = useState(false);

    useEffect(() => {
        let { type } = window.screen.orientation;
        setLandscape(type.startsWith("landscape"));

        window.addEventListener('devicemotion', handleAcceleration);
        window.screen.orientation.addEventListener('change', handleOrientation);
        return () => {
            window.removeEventListener('devicemotion', handleAcceleration);
            window.screen.orientation.removeEventListener('change', handleOrientation);
        }
    });

    const handleAcceleration = (event) => {
        let {x, y, z} = useGravity ? event.accelerationIncludingGravity : event.acceleration;
        let acceleration = {
            x: (landscape ? y : x) * multiplier,
            y: (landscape ? x : y) * multiplier,
            z: z * multiplier
        };
        let rotation = event.rotationRate || { alpha: 0, beta: 0, gamma: 0 };

        setAcceleration(acceleration);
        setRotation(rotation);
    };

    const handleOrientation = (event) => {
        let { type } = window.screen.orientation;
        setLandscape(type.startsWith("landscape"));
    };

    return children(acceleration, rotation);
};

export default Accelerometer;
