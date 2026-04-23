import ActionMode from "./ActionMode.js";
import StandardSlagenSelector from "./StandardSlagenSelector.js";
export default class AbondanceMode extends ActionMode {
    constructor(name, threshold, base) {
        super(name, threshold, base, 0, 1, 1);
        this.slagenSelector = new StandardSlagenSelector();
    }
    clone(name = this.name, base = this.base) {
        return new AbondanceMode(name, this.threshold, base);
    }
    getScoreDelta(goingPlayers, deler, trul) {
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        if (trul)
            throw new Error('dit mag niet boven trul');
        let slagen = this.slagenSelector.getSlagen();
        let perP = slagen >= this.threshold ? this.base : -this.base;
        return this.perPlayerToScoreDelta(perP, goingPlayers, deler);
    }
    renderSlagenSelector(htmlId) {
        this.slagenSelector.render(htmlId);
    }
}
