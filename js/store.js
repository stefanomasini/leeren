import { buildEvent } from "fluqs";
import actions from "actions";
import { animate } from "animation";

const ANIMATION_DURATION_IN_MS = 300;

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function randomTime() {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 12) * 5;
    return { hour, minute }
}

function calcPos(time) {
    return ((time.hour === 12) ? 0 : time.hour) / 12 + time.minute / 60 / 12;
}

function normalizeHour(hour) {
    while (hour > 12) {
        hour -= 12;
    }
    while (hour <= 0) {
        hour += 12;
    }
    return hour;
}

function normalize(hour, minute) {
    while (minute >= 60) {
        minute -= 60;
        hour += 1;
    }
    while (minute < 0) {
        minute += 60;
        hour -= 1;
    }
    hour = normalizeHour(hour);
    return [hour, minute];
}

function dutchName(num) {
    return {
        12: 'twaalf',
        1: 'een',
        2: 'twee',
        3: 'drie',
        4: 'vier',
        5: 'vijf',
        6: 'zes',
        7: 'zeven',
        8: 'acht',
        9: 'negen',
        10: 'tien',
        11: 'elf',
        15: 'kwart'
    }[num];
}

function buildDutchName(hour, minute) {
    if (minute == 0) {
        return `${dutchName(hour)} uur`;
    } else if (minute <= 15) {
        return `${dutchName(minute)} over ${dutchName(hour)}`;
    } else if (minute < 30) {
        return `${dutchName(30 - minute)} voor half ${dutchName(normalizeHour(hour + 1))}`;
    } else if (minute == 30) {
        return `half ${dutchName(normalizeHour(hour + 1))}`;
    } else if (minute < 45) {
        return `${dutchName(minute - 30)} over half ${dutchName(normalizeHour(hour + 1))}`;
    } else {
        return `${dutchName(60 - minute)} voor ${dutchName(normalizeHour(hour + 1))}`;
    }
}

export class ClockStore {
    constructor() {
        this.hour = 12;
        this.minute = 0;
        this.pos = 0;
        this._buildName();
        this.animation = false;

        this.changeEvent = buildEvent();

        actions.clock.addMinutes.listen(minutes => {
            if (this.animation) {
                return;
            }
            this.minute += minutes;
            this._normalize();
            this._buildName();
            this._animateTo(calcPos({ hour: this.hour, minute: this.minute }));
        });

        actions.clock.goToRandom.listen(() => {
            if (this.animation) {
                return;
            }
            const t = randomTime();
            this.hour = t.hour;
            this.minute = t.minute;
            this._normalize();
            this._buildName();
            this._animateTo(calcPos(t));
        });
    }

    _animateTo(newPos) {
        this.animation = true;

        newPos = newPos % 1;
        this.pos = this.pos % 1;
        let newPosA, newPosB;
        if (newPos < this.pos) {
            newPosA = newPos;
            newPosB = newPos + 1;
        } else {
            newPosA = newPos - 1;
            newPosB = newPos;
        }
        if (Math.abs(newPosA - this.pos) < Math.abs(newPosB - this.pos)) {
            newPos = newPosA;
        } else {
            newPos = newPosB;
        }

        this.changeEvent();
        animate(this.pos, newPos, ANIMATION_DURATION_IN_MS, pos => {
            this.pos = pos;
            this.changeEvent();
        }, () => {
            this.animation = false;
            this.changeEvent();
        });
    }

    _normalize() {
        [ this.hour, this.minute ] = normalize(this.hour, this.minute);
    }

    _buildName() {
        this.name = buildDutchName(this.hour, this.minute);
    }
}
