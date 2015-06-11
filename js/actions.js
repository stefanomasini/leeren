import { buildActions } from "fluqs";

export default buildActions({
    clock: {
        move: [/* direction */ String],
        addMinutes: [/* minutes */ Number],
        goToRandom: [],
        selectTab: [/* tab */ String],
        checkCorrectness: [],
        tryAgain: []
    }
});
