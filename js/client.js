import React from "react";

import actions from "actions";
import { Clock, Hour } from "views/clock";
import { ClockStore } from "store";

const Button = React.createClass({
    render() {
        return <div>
            <button className="btn btn-default btn-lg" {...this.props} style={{width: 100, margin: 5}}>{this.props.children}</button>
        </div>;
    }
});

const Main = React.createClass({
    render() {
        return <div className="row" style={{margin: 20}}>
            <div className="col-md-4" style={{textAlign: 'center'}}>
                <div>
                    <Clock size={300} store={this.props.clockStore}/>
                </div>
                <Hour store={this.props.clockStore}/>
            </div>
            <div className="col-md-4">
                <Button onClick={() => actions.clock.addMinutes(5)} disabled={this.props.clockStore.animation}>+5 min</Button>
                <Button onClick={() => actions.clock.addMinutes(-5)} disabled={this.props.clockStore.animation}>-5 min</Button>
                <Button onClick={() => actions.clock.addMinutes(30)} disabled={this.props.clockStore.animation}>+30 min</Button>
                <Button onClick={() => actions.clock.addMinutes(-30)} disabled={this.props.clockStore.animation}>-30 min</Button>
                <Button onClick={() => actions.clock.goToRandom()} disabled={this.props.clockStore.animation}>Random</Button>
            </div>
        </div>;
    }
});

const clockStore = new ClockStore();

React.render(<Main clockStore={clockStore}/>, document.getElementById('container'));
