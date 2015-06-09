import React from "react";

const style = {
    black: '#000000',
    strokeWidth: 2,
    textSize: 20,
    dotSize: 3,
    centerSize: 7,
    hoursStrokeWidth: 8,
    minuteStrokeWidth: 5
};

const Clock = React.createClass({
    render() {
        const radius = this.props.size / 2;
        const center = this.props.size / 2 + style.strokeWidth / 2;
        const polar = (angle, distance) => {
            angle = Math.PI / 2 - angle;
            return [Math.cos(angle) * distance * radius + center, center - Math.sin(angle) * distance * radius];
        };
        const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const numbersDom = numbers.map( (number, idx) => {
            let [x, y] = polar(number * Math.PI / 6, 0.9);
            return <text key={idx} x={x} y={y + style.textSize / 2 - 3} style={{textAnchor: 'middle', fontSize: style.textSize}}>{number}</text>
        });
        const dots = numbers.map( (number, idx) => {
            let [x, y] = polar(number * Math.PI / 6, 0.8);
            return <circle key={idx} style={{stroke: style.black, fill: style.black}} cx={x} cy={y} r={style.dotSize / 2}/>
        });
        var hourPerc = this.props.pos;
        var minutePerc = hourPerc * 12;
        const [hourX, hourY] = polar(Math.PI * 2 * hourPerc, 0.4);
        const [minuteX, minuteY] = polar(Math.PI * 2 * minutePerc, 0.7);
        return <svg height={this.props.size + style.strokeWidth} width={this.props.size + style.strokeWidth}>
            <circle style={{
                stroke: style.black,
                strokeWidth: style.strokeWidth,
                fill: 'transparent'
                }} cx={center} cy={center} r={radius}/>
            {numbersDom}
            {dots}
            <circle style={{stroke: style.black, fill: style.black}} cx={center} cy={center} r={style.centerSize}/>
            <line x1={center} y1={center} x2={hourX} y2={hourY} style={{stroke: style.black, strokeWidth: style.hoursStrokeWidth}}/>
            <line x1={center} y1={center} x2={minuteX} y2={minuteY} style={{stroke: style.black, strokeWidth: style.minuteStrokeWidth}}/>
        </svg>;
    }
});


const ANIMATION_DURATION_IN_MS = 300;

function animate(animationFrom, animationTo, duration, cb, done) {
    const animationStarted = Date.now();
    const _animate = () => {
        const elapsed = Date.now() - animationStarted;
        if (elapsed > duration) {
            cb(animationTo);
            done();
            return;
        }
        const v = Math.sin(Math.PI / 2 * elapsed / duration);
        cb(animationFrom + (animationTo - animationFrom) * v);
        requestAnimationFrame(_animate);
    };
    requestAnimationFrame(_animate);
}

const MINUTE = 1 / 12 / 60;

const Main = React.createClass({
    getInitialState() {
        return {
            pos: 0,
            animation: false
        }
    },
    render() {
        return <div>
            <button className="btn btn-default" onClick={() => this.add(5*MINUTE)} disabled={this.animation}>+5 min</button>
            <button className="btn btn-default" onClick={() => this.add(-5*MINUTE)} disabled={this.animation}>-5 min</button>
            <button className="btn btn-default" onClick={() => this.add(30*MINUTE)} disabled={this.animation}>+30 min</button>
            <button className="btn btn-default" onClick={() => this.add(-30*MINUTE)} disabled={this.animation}>-30 min</button>
            <div>
                <Clock size={300} pos={this.state.pos}/>
            </div>
        </div>;
    },
    add(amount) {
        if (this.state.animation) {
            return;
        }
        this.setState({animation: true});
        animate(this.state.pos, this.state.pos + amount, ANIMATION_DURATION_IN_MS, pos => this.setState({pos: pos}), () => this.setState({animation: false}));
    }
});

React.render(<Main/>, document.getElementById('container'));
