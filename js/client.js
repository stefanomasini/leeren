import React from "react";

import actions from "actions";
import { Clock } from "views/clock";
import { ClockStore } from "store";


const MINUTE = 1 / 12 / 60;

const Main = React.createClass({
    render() {
        return <div>
            <button className="btn btn-default" onClick={() => actions.clock.animateTo(this.props.clockStore.pos + 5*MINUTE)} disabled={this.props.clockStore.animation}>+5 min</button>
            <button className="btn btn-default" onClick={() => actions.clock.animateTo(this.props.clockStore.pos - 5*MINUTE)} disabled={this.props.clockStore.animation}>-5 min</button>
            <button className="btn btn-default" onClick={() => actions.clock.animateTo(this.props.clockStore.pos + 30*MINUTE)} disabled={this.props.clockStore.animation}>+30 min</button>
            <button className="btn btn-default" onClick={() => actions.clock.animateTo(this.props.clockStore.pos - 30*MINUTE)} disabled={this.props.clockStore.animation}>-30 min</button>
            <div>
                <Clock size={300} store={this.props.clockStore}/>
            </div>
        </div>;
    }
});

const clockStore = new ClockStore();

React.render(<Main clockStore={clockStore}/>, document.getElementById('container'));
