import React from "react";

import actions from "actions";
import { forceUpdateMixin } from "fluqs";
import { Clock, Hour } from "views/clock";
import { ClockStore } from "stores/clock";
import { MainStore } from "stores/main";
import { Button, Glyphicon, TabbedArea, TabPane } from "react-bootstrap";


const Btn = React.createClass({
    render() {
        return <Button
                    style={{width: this.props.width || 60, margin: 5}}
                    onTouchStart={this.onDown}
                    onMouseDown={this.onDown}
                    onTouchEnd={this.onUp}
                    onMouseUp={this.onUp}
                {...this.props}>{this.props.children}</Button>;
    },
    onDown(e) {
        e.preventDefault();
        this.props.onDown && this.props.onDown();
    },
    onUp(e) {
        e.preventDefault();
        this.props.onUp && this.props.onUp();
    }
});

const ClockTab = React.createClass({
    render() {
        return <div style={{textAlign: 'center', margin: 10}}>
            <div>
                <Clock size={300} store={this.props.mainStore.mainClockStore}/>
            </div>
            <Hour store={this.props.mainStore.mainClockStore}/>
            <div>
                <Btn onDown={() => actions.clock.move('left')} onUp={() => actions.clock.move(null)}>
                    <Glyphicon glyph='triangle-left'/>
                </Btn>
                <Btn onDown={() => actions.clock.move('right')} onUp={() => actions.clock.move(null)}>
                    <Glyphicon glyph='triangle-right'/>
                </Btn>
            </div>
            <div>
                <Btn onDown={() => actions.clock.goToRandom()} width={100}>Random</Btn>
            </div>
        </div>;
    }
});

const GameTab = React.createClass({
    mixins: [forceUpdateMixin(function () { return this.props.mainStore.changeEvent; })],
    render() {
        let status = null;
        if (this.props.mainStore.correct === null) {
            status = <Button bsSize='large' onClick={() => actions.clock.checkCorrectness()} width={100}>Klaar</Button>;
        } else if (this.props.mainStore.correct) {
            status = <Button bsSize='large' bsStyle='success' onClick={() => actions.clock.tryAgain()} width={100}><Glyphicon glyph='thumbs-up'/> Nog een keer</Button>;
        } else {
            status = <Button bsSize='large' bsStyle='danger' onClick={() => actions.clock.checkCorrectness()} width={100}><Glyphicon glyph='thumbs-down'/> Probeer opniew</Button>;
        }
        return <div style={{textAlign: 'center', margin: 10}}>
            <div>
                <Clock size={300} store={this.props.mainStore.mainClockStore}/>
            </div>
            <Hour store={this.props.mainStore.secondaryClockStore} numbers={false}/>
            <div>
                <Btn onDown={() => actions.clock.move('left')} onUp={() => actions.clock.move(null)}>
                    <Glyphicon glyph='triangle-left'/>
                </Btn>
                <Btn onDown={() => actions.clock.move('right')} onUp={() => actions.clock.move(null)}>
                    <Glyphicon glyph='triangle-right'/>
                </Btn>
            </div>
            <div>
                {status}
            </div>
        </div>;
    },
    onDone() {
        if (this.props.mainStore.correct) {
            actions.clock.tryAgain();
        } else {
            actions.clock.checkCorrectness();
        }
    }
});

const Main = React.createClass({
    mixins: [forceUpdateMixin(function () { return this.props.mainStore.changeEvent; })],
    render() {
        return <div>
            <TabbedArea activeKey={this.props.mainStore.selectedTab} onSelect={tab => actions.clock.selectTab(tab)}>
                <TabPane eventKey={'clock'} tab='Clock'>
                    <ClockTab {...this.props}/>
                </TabPane>
                <TabPane eventKey={'game'} tab='Game'>
                    <GameTab {...this.props}/>
                </TabPane>
            </TabbedArea>
        </div>;
    }
});

const mainStore = new MainStore();

React.initializeTouchEvents(true);
React.render(<Main mainStore={mainStore}/>, document.getElementById('container'));
