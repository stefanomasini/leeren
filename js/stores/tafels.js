import { buildEvent } from "fluqs";
import actions from "actions";


const MAX_VALUE_LENGTH = 3;

const numbers1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const numbers1to12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function chooseRandom(values) {
    return values[Math.floor(Math.random() * values.length)];
}

export class TafelsStore {
    constructor() {
        this.changeEvent = buildEvent();
        this._init();

        actions.digitPressed.listen(digit => {
            if (digit === 'delete') {
                if (this.enteredValue.length > 0) {
                    this.enteredValue = this.enteredValue.slice(0, this.enteredValue.length-1);
                    this.changeEvent();
                }
            } else {
                if (this.enteredValue.length < 3) {
                    this.enteredValue += digit;
                    this.changeEvent();
                }
            }
        });
    }

    getOperands() {
        if (this.incognita === 'a') {
            return [this._viewValue(), this.b, this.c];
        } else if (this.incognita === 'b') {
            return [this.a, this._viewValue(), this.c];
        } else {
            return [this.a, this.b, this._viewValue()];
        }
    }

    _viewValue() {
        var value = this.enteredValue;
        while (value.length < MAX_VALUE_LENGTH) {
            value += '_';
        }
        return value;
    }

    _init() {
        this.enteredValue = '';
        this.incognita = chooseRandom(['a', 'b', 'c']);
        const numbers = numbers1to9;
        this.a = chooseRandom(numbers);
        this.b = chooseRandom(numbers);
        this.c = this.a * this.b;
    }

    reset() {
        this._init();
        this.changeEvent();
    }

    checkCorrectness() {
        const value = parseInt(this.enteredValue, 10);
        if (this.incognita === 'a') {
            return value === this.a;
        } else if (this.incognita === 'b') {
            return value === this.b;
        } else {
            return value === this.c;
        }
    }
}
