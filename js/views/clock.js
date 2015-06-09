import React from "react";
import { forceUpdateMixin } from "fluqs";

const style = {
    black: '#000000',
    strokeWidth: 2,
    textSize: 20,
    dotSize: 3,
    centerSize: 7,
    hoursStrokeWidth: 8,
    minuteStrokeWidth: 5
};

export const Clock = React.createClass({
    mixins: [forceUpdateMixin(function () { return this.props.store.changeEvent; })],
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
        var hourPerc = this.props.store.pos;
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
