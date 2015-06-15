import React from "react";

import actions from "actions";
import { forceUpdateMixin, setDebug } from "fluqs";
import { Clock, Hour } from "views/clock";
import { ClockStore } from "stores/clock";
import { MainStore } from "stores/main";
import { Button, Glyphicon, TabbedArea, TabPane } from "react-bootstrap";


//setDebug(true);


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

const DoneAndStatus = React.createClass({
    render() {
        if (this.props.mainStore.correct === null) {
            return <Button bsSize='large' onClick={() => actions.clock.checkCorrectness()} width={100}>Klaar</Button>;
        } else if (this.props.mainStore.correct) {
            return <Button bsSize='large' bsStyle='success' onClick={() => actions.clock.tryAgain()} width={100}><Glyphicon glyph='thumbs-up'/> Nog een keer</Button>;
        } else {
            return <Button bsSize='large' bsStyle='danger' onClick={() => actions.clock.checkCorrectness()} width={100}><Glyphicon glyph='thumbs-down'/> Probeer opniew</Button>;
        }
    }
});

const GameTab = React.createClass({
    mixins: [forceUpdateMixin(function () { return this.props.mainStore.changeEvent; })],
    render() {
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
                <DoneAndStatus {...this.props}/>
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

const Digit = React.createClass({
    render() {
        return <Button bsSize="large" onTouchStart={this.onDown} onMouseDown={this.onDown}>{this.props.value}</Button>
    },
    onDown(e) {
        e.preventDefault();
        actions.digitPressed(this.props.value);
    }
});

const Backspace = React.createClass({
    render() {
        return <Button bsSize="large" style={{width: 90}} onTouchStart={this.onDown} onMouseDown={this.onDown}><Glyphicon glyph='arrow-left'/></Button>
    },
    onDown(e) {
        e.preventDefault();
        actions.digitPressed('delete');
    }
});

const TafelsTab = React.createClass({
    mixins: [forceUpdateMixin(function () { return this.props.store.changeEvent; })],
    render() {
        const [a, b, c] = this.props.store.getOperands();
        return <div style={{textAlign: 'center', margin: 10}}>
            <div>
                <h2>{a} x {b} = {c}</h2>
            </div>
            <div style={{margin: 20}}>
                <Digit value="7"/>
                <Digit value="8"/>
                <Digit value="9"/><br/>
                <Digit value="4"/>
                <Digit value="5"/>
                <Digit value="6"/><br/>
                <Digit value="1"/>
                <Digit value="2"/>
                <Digit value="3"/><br/>
                <Digit value="0"/><Backspace/>
            </div>
            <div style={{margin: 20}}>
                <DoneAndStatus {...this.props}/>
            </div>
        </div>;
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
                <TabPane eventKey={'tafels'} tab='Tafels'>
                    <TafelsTab store={this.props.mainStore.tafelsStore} {...this.props}/>
                </TabPane>
            </TabbedArea>
        </div>;
    }
});

const mainStore = new MainStore();

React.initializeTouchEvents(true);
React.render(<Main mainStore={mainStore}/>, document.getElementById('container'));
