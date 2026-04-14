import ActionMode from "./ActionMode.js";
import StandardSlagenSelector from "./StandardSlagenSelector.js";

export default class AbondanceMode extends ActionMode{
    private slagenSelector: StandardSlagenSelector = new StandardSlagenSelector();

    constructor(name: string, threshold: number, base: number){
        super(name, threshold, base, 0, 1, 1);
    }
    
    clone(name: string = this.name, base: number = this.base): ActionMode{
        return new AbondanceMode(name, this.threshold, base);
    }

    getScoreDelta(goingPlayers: Array<boolean>, deler: number): Array<number> {
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        let slagen = this.slagenSelector.getSlagen();
        let perP = slagen >= this.threshold ? this.base : -this.base;
        return this.perPlayerToScoreDelta(perP, goingPlayers, deler);
    }

    renderSlagenSelector(htmlId: string){
        this.slagenSelector.render(htmlId);
    }
}