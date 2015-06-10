import { buildActions } from "fluqs";

export default buildActions({
    clock: {
        addMinutes: [/* minutes */ Number],
        goToRandom: [],
        selectTab: [/* tab */ String],
        checkCorrectness: [],
        tryAgain: []
    }
});
