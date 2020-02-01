import {useCallback, useEffect, useState} from "react";

let accelerationReset;

const Accelerometer = (props) => {
    const {sensorActive = true, useGravity = false, multiplier = 1, children} = props;

    const [rotation, setRotation] = useState({alpha: 0, beta: 0, gamma: 0, turning: 0});
    const resetRotation = useCallback(() => setRotation({alpha: 0, beta: 0, gamma: 0, turning: 0}), [setRotation]);

    const [landscape, setLandscape] = useState(false);
    const [acceleration, setAcceleration] = useState({x: 0, y: 0, z: 0, stepInOut: 0});
    const resetAcceleration = useCallback(() => setAcceleration({x: 0, y: 0, z: 0, stepInOut: 0}), [setAcceleration]);

    useEffect(() => {
        if (sensorActive) {
            const handleOrientation = (event) => {
                let {type} = window.screen.orientation;
                setLandscape(type.startsWith('landscape'));
                console.log(`device turned: ${type}`);
            };

            const handleAcceleration = (event) => {
                let {x, y, z} = useGravity ? event.accelerationIncludingGravity : event.acceleration;
                let newAcceleration = {
                    x: (landscape ? y : x) * multiplier,
                    y: (landscape ? x : y) * multiplier,
                    z: z * multiplier,
                    stepInOut: 0
                };

                let accelerationChanged = true;
                let oldSum = 0;
                let newSum = 0;
                for (const key in newAcceleration) {
                    oldSum += Math.floor((acceleration[key] * 100) || 0);
                    newSum += Math.floor((newAcceleration[key] * 100) || 0);
                }
                if (oldSum !== 0 && oldSum === newSum) {
                    accelerationChanged = false;
                }

                // reset acceleration if it doesn't change in time
                if (accelerationChanged) {
                    clearTimeout(accelerationReset);
                    accelerationReset = setTimeout(resetAcceleration, 300);
                    setAcceleration({
                        ...newAcceleration,
                        stepInOut: (newAcceleration.z + newAcceleration.x) / 2.0
                    });
                }

                if (event.rotationRate) {
                    let {alpha, beta, gamma} = event.rotationRate;
                    setRotation({
                        alpha,
                        beta,
                        gamma,
                        turning: (beta + gamma) / 2.0
                    });
                } else {
                    resetRotation();
                }
            };

            let {type} = window.screen.orientation;
            setLandscape(type.startsWith("landscape"));

            window.addEventListener('devicemotion', handleAcceleration);
            window.screen.orientation.addEventListener('change', handleOrientation);
            return () => {
                window.removeEventListener('devicemotion', handleAcceleration);
                window.screen.orientation.removeEventListener('change', handleOrientation);
            }
        } else {
            resetAcceleration();
            resetRotation();
        }
    }, [acceleration, landscape, setLandscape, multiplier, useGravity, sensorActive, resetRotation, resetAcceleration]);

    return children(acceleration, rotation);
};

export default Accelerometer;
