import { buildEvent } from "fluqs";
import actions from "actions";
import { animate } from "animation";

const ANIMATION_DURATION_IN_MS = 300;

export class ClockStore {
    constructor() {
        this.pos = 0;
        this.animation = false;
        this.changeEvent = buildEvent();
        actions.clock.animateTo.listen(newPos => {
            if (this.animation) {
                return;
            }
            this.animation = true;
            this.changeEvent();
            animate(this.pos, newPos, ANIMATION_DURATION_IN_MS, pos => {
                this.pos = pos;
                this.changeEvent();
            }, () => {
                this.animation = false;
                this.changeEvent();
            });
        })
    }
}
