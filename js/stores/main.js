import { buildEvent } from "fluqs";
import actions from "actions";
import { ClockStore } from "stores/clock";


export class MainStore {
    constructor() {
        this.selectedTab = 'clock';
        this.mainClockStore = new ClockStore();
        this.secondaryClockStore = new ClockStore();

        this.changeEvent = buildEvent();

        actions.clock.addMinutes.listen(minutes => this.mainClockStore.addMinutes(minutes));
        actions.clock.goToRandom.listen(() => this.mainClockStore.goToRandom());

        actions.clock.selectTab.listen(tab => {
            this.selectedTab = tab;
            this.mainClockStore.reset();
            this.secondaryClockStore.goToRandom();
            this.correct = null;
            this.changeEvent();
        });

        actions.clock.checkCorrectness.listen(() => {
            this.correct = (this.mainClockStore.getTimeStr() === this.secondaryClockStore.getTimeStr());
            this.changeEvent();
        });

        actions.clock.tryAgain.listen(() => {
            this.mainClockStore.reset();
            this.secondaryClockStore.goToRandom();
            this.correct = null;
            this.changeEvent();
        });
    }
}
