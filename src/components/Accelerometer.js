import {useCallback, useEffect, useState} from "react";

let accelerationReset;
let accelerationStart = null;

const useAccelerationSensor = ({frequency = 10, sensorActive = true, referenceFrame = 'screen'}) => {
    const [sensor, setSensor] = useState(null);

    // init
    useEffect(() => {
        if (!sensor) {
            if ((typeof window !== 'undefined') && ('Accelerometer' in window)) {
                const instance = new window.Accelerometer({frequency, referenceFrame});
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

const Accelerometer = (props) => {
    let {sensorActive = true, multiplier = 1, children} = props;

    const sensor = useAccelerationSensor({frequency: 20, sensorActive});

    const [rotation, setRotation] = useState({alpha: 0, beta: 0, gamma: 0, turning: 0});
    const resetRotation = useCallback(() => setRotation({alpha: 0, beta: 0, gamma: 0, turning: 0}), [setRotation]);

    const [acceleration, setAcceleration] = useState({x: 0, y: 0, z: 0, distanceX: 0, distanceY: 0, distanceZ: 0, stepInOut: 0});
    const resetAcceleration = useCallback(() => setAcceleration({x: 0, y: 0, z: 0, distanceX: 0, distanceY: 0, distanceZ: 0, stepInOut: 0}), []);

    const handleRotation = useCallback((event) => {
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
    }, [setRotation, resetRotation]);

    const handleLinearAcceleration = useCallback(() => {
        const {x, y, z, timestamp} = sensor;

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

            console.log(`old | ${accelerationStart} || new | ${timestamp}`);
            const centimetersTravelled = (accelerationValue, seconds) => 50 * accelerationValue * seconds * seconds;

            if (accelerationStart)
                console.log(`secondsAfterChange: ${(timestamp - accelerationStart) / 1000.0}`);
            const secondsAfterChange = accelerationStart ? ((timestamp - accelerationStart) / 1000.0) : 0;

            accelerationStart = timestamp;

            const distances = secondsAfterChange < 0.3 ?
                {
                    distanceX: centimetersTravelled(newAcceleration.x, secondsAfterChange),
                    distanceY: centimetersTravelled(newAcceleration.y, secondsAfterChange),
                    distanceZ: centimetersTravelled(newAcceleration.z, secondsAfterChange),
                } : {
                    distanceX: 0,
                    distanceY: 0,
                    distanceZ: 0,
                };

            setAcceleration({
                ...newAcceleration,
                ...distances,
                stepInOut: (-distances.distanceZ + distances.distanceY) / 2.0
            });
            accelerationReset = setTimeout(resetAcceleration, 300);
        }
    });

    useEffect(() => {
        if (sensor) {
            if (sensorActive) {
                sensor.addEventListener('reading', handleLinearAcceleration);
                console.log('acceleration sensor | subscribed');

                return () => {
                    sensor.removeEventListener('reading', handleLinearAcceleration);
                    console.log('acceleration sensor | unsubscribed');
                }
            } else {
                resetAcceleration();
            }
        }
    }, [sensor]);


    useEffect(() => {
        if (sensorActive) {
            window.addEventListener('devicemotion', handleRotation);
            return () => {
                window.removeEventListener('devicemotion', handleRotation);
            }
        } else {
            resetRotation();
        }
    }, [sensorActive]);

    return children(acceleration, rotation);
};

export default Accelerometer;
