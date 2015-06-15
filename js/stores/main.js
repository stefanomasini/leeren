import { buildEvent } from "fluqs";
import actions from "actions";
import { ClockStore } from "stores/clock";
import { TafelsStore } from "stores/tafels";


export class MainStore {
    constructor() {
        this.selectedTab = 'tafels';
        this.mainClockStore = new ClockStore();
        this.secondaryClockStore = new ClockStore();
        this.tafelsStore = new TafelsStore();
        this.correct = null;

        this.changeEvent = buildEvent();

        actions.clock.addMinutes.listen(minutes => this.mainClockStore.addMinutes(minutes));
        actions.clock.goToRandom.listen(() => this.mainClockStore.goToRandom());
        actions.clock.move.listen(direction => this.mainClockStore.move(direction));

        actions.clock.selectTab.listen(tab => {
            this.selectedTab = tab;
            if (this.selectedTab === 'game') {
                this.mainClockStore.reset();
                this.secondaryClockStore.goToRandom();
            } else if (this.selectedTab === 'tafels') {
                this.tafelsStore.reset();
            }
            this.correct = null;
            this.changeEvent();
        });

        actions.clock.checkCorrectness.listen(() => {
            if (this.selectedTab === 'game') {
                this.correct = (this.mainClockStore.getTimeStr() === this.secondaryClockStore.getTimeStr());
            } else if (this.selectedTab === 'tafels') {
                this.correct = this.tafelsStore.checkCorrectness();
            }
            this.changeEvent();
        });

        actions.clock.tryAgain.listen(() => {
            if (this.selectedTab === 'game') {
                this.mainClockStore.reset();
                this.secondaryClockStore.goToRandom();
            } else if (this.selectedTab === 'tafels') {
                this.tafelsStore.reset();
            }
            this.correct = null;
            this.changeEvent();
        });
    }
}
