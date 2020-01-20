import React from "react";

export class ReactAccelerometer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acceleration: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                alpha: 0,
                beta: 0,
                gamma: 0
            },
            landscape: false
        };
        this.handleAcceleration = this.handleAcceleration.bind(this);
        this.handleOrientation = this.handleOrientation.bind(this);
    }

    componentDidMount() {
        this.handleOrientation();
        window.addEventListener('devicemotion', this.handleAcceleration);
        window.addEventListener('orientationchange', this.handleOrientation);
    }

    componentWillUnmount() {
        window.removeEventListener('devicemotion', this.handleAcceleration);
        window.removeEventListener('orientationchange', this.handleOrientation);
    }

    handleOrientation(event) {
        let orientation = window.orientation;
        this.setState({landscape: orientation === 90 || orientation === -90});
    }

    handleAcceleration(event) {

        let {useGravity, multiplier} = this.props;
        let landscape = this.state.landscape;
        let {x, y, z} = useGravity ? event.accelerationIncludingGravity : event.acceleration;
        let acceleration = {
            x: (landscape ? y : x) * multiplier,
            y: (landscape ? x : y) * multiplier,
            z: z * multiplier
        };
        let rotation = event.rotationRate || null;

        this.setState({
            rotation,
            acceleration
        });
    }

    render() {
        let children = this.props.children;
        let {acceleration, rotation} = this.state;
        if (acceleration.x || acceleration.y || acceleration.z) {
            return children(acceleration, rotation);
        }
        return children({x: 0, y: 0, z: 0}, {alpha: 0, beta: 0, gamma: 0});
    }
}

ReactAccelerometer.defaultProps = {
    multiplier: 1,
    useGravity: true
};
export default ReactAccelerometer;
