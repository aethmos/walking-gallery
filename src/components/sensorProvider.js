import {useCallback, useEffect, useState} from "react";

let accelerationReset;
let orientation = null;

const useAccelerationSensor = ({frequency = 10, sensorActive = true, referenceFrame = 'screen'}) => {
    const [sensor, setSensor] = useState(null);

    // init
    useEffect(() => {
        if (!sensor) {
            if ((typeof window !== 'undefined') && ('LinearAccelerationSensor' in window)) {
                let instance;
                if ('LinearAccelerationSensor' in window)
                    instance = new window.LinearAccelerationSensor({frequency, referenceFrame});
                setSensor(instance);
                console.log('acceleration sensor | initialized');
                console.log(instance);
            }
            return () => {
                setSensor(null);
            }
        }
    }, [referenceFrame, frequency]);

    // start / stop
    useEffect(() => {
        if (sensor) {
            if (sensorActive && !sensor.active) {
                sensor.start();
                console.log('acceleration sensor | started');
            } else if (!sensorActive && sensor.active) {
                sensor.stop();
                console.log('acceleration sensor | stopped');
            }
        }
    }, [sensor, sensorActive]);

    return sensor;
};

const SensorProvider = (props) => {
    let {sensorActive = true, multiplier = 1, children} = props;

    const sensor = useAccelerationSensor({frequency: 20, sensorActive});

    const [rotation, setRotation] = useState({alpha: 0, beta: 0, gamma: 0, turning: 0});
    const resetRotation = useCallback(() => setRotation({alpha: 0, beta: 0, gamma: 0, turning: 0}), [setRotation]);

    const [acceleration, setAcceleration] = useState({x: 0, y: 0, z: 0, stepInOut: 0});
    const resetAcceleration = useCallback(() => setAcceleration({x: 0, y: 0, z: 0, stepInOut: 0}), []);

    const handleRotation = useCallback((event) => {
        function getTurningFactor(alpha, beta, gamma) {
            console.log(orientation);
            switch (orientation) {
                // portrait
                case 'portrait':
                case 'portrait-primary':
                    return (beta + gamma) / 2.0;
                // portrait - upside down
                case 'portrait-secondary':
                    return (-beta - gamma) / 2.0;
                // landscape - bottom is on the right
                case 'landscape':
                case 'landscape-primary':
                    return (alpha + gamma) / 2.0;
                // landscape - bottom is on the left
                case 'landscape-secondary':
                    return (-alpha - gamma) / 2.0;
                default:
                    return (beta + gamma) / 2.0;
            }
        }

        if (event.rotationRate) {
            let {alpha, beta, gamma} = event.rotationRate;
            setRotation({
                alpha,
                beta,
                gamma,
                turning: getTurningFactor(alpha, beta, gamma),
                x: JSON.stringify(event.acceleration.x),
                y: JSON.stringify(event.acceleration.y),
                z: JSON.stringify(event.acceleration.z)
            });
        } else {
            resetRotation();
        }
    }, [setRotation, resetRotation]);

    const handleLinearAcceleration = useCallback(() => {
        const {x, y, z} = sensor;

        let newAcceleration = {
            x: x * multiplier,
            y: y * multiplier,
            z: z * multiplier
        };

        let accelerationChanged = true;
        let oldSum = 0;
        let newSum = 0;
        for (const key in ['x', 'y', 'z']) {
            oldSum += Math.floor((acceleration[key] * 10) || 0);
            newSum += Math.floor((newAcceleration[key] * 10) || 0);
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
                stepInOut: (-newAcceleration.z * (2 / 3) + (1 / 3) * newAcceleration.y)
            });
        }
    });

    useEffect(() => {
        if (sensor) {
            if (sensorActive) {
                sensor.addEventListener('reading', handleLinearAcceleration);
                console.log('acceleration sensor | subscribed');
            } else {
                resetAcceleration();
                return () => {
                    sensor.removeEventListener('reading', handleLinearAcceleration);
                    console.log('acceleration sensor | unsubscribed');
                }
            }
        }
    }, [sensor]);


    const handleOrientation = useCallback(() => {
        orientation = window.screen.orientation.type;
        if (orientation.startsWith('landscape'))
            window.document.documentElement.requestFullscreen();
        else
            window.document.exitFullscreen();


    });

    useEffect(() => {
        if (sensorActive) {
            window.screen.orientation.addEventListener('change', handleOrientation);
            window.addEventListener('devicemotion', handleRotation);
            return () => {
                window.screen.orientation.removeEventListener('change', handleOrientation);
                window.removeEventListener('devicemotion', handleRotation);
            }
        } else {
            resetRotation();
        }
    }, [sensorActive]);

    return children(acceleration, rotation);
};

export default SensorProvider;
