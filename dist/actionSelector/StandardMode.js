import ActionMode from "./ActionMode.js";
import StandardSlagenSelector from "./StandardSlagenSelector.js";
export default class StandardMode extends ActionMode {
    constructor(name, base, overslag) {
        super(name, 0, base, overslag, 1, 2);
        this.slagenSelector = new StandardSlagenSelector();
    }
    clone(name = this.name, base = this.base, overslag = this.over) {
        return new StandardMode(name, base, overslag);
    }
    getScoreDelta(goingPlayers, deler, trul) {
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        if (trul && goingCount < 2)
            throw new Error('trul gaat niet alleen');
        let slagen = this.slagenSelector.getSlagen();
        let threshold = 8;
        if (goingCount < 2)
            threshold = 5;
        let perP = this.over * (slagen - threshold) + (slagen >= threshold ? this.base : -this.base);
        if (slagen == 13 || perP < 0 || trul)
            perP *= 2;
        return this.perPlayerToScoreDelta(perP, goingPlayers, deler);
    }
    renderSlagenSelector(htmlId) {
        this.slagenSelector.render(htmlId);
    }
}
