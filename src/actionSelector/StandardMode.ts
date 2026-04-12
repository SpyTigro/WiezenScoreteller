import ActionMode from "./ActionMode.js";
import StandardSlagenSelector from "./StandardSlagenSelector.js";

export default class StandardMode extends ActionMode{
    private slagenSelector: StandardSlagenSelector = new StandardSlagenSelector();

    constructor(name: string, base: number, overslag: number){
        super(name, 0, base, overslag, 1, 2);
    }
    
    clone(name: string, base: number, overslag: number): ActionMode{
        return new StandardMode(name, base, overslag);
    }

    getScoreDelta(goingPlayers: Array<boolean>, deler: number): Array<number> {
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        let slagen = this.slagenSelector.getSlagen();
        let threshold = 8;
        if(goingCount < 2) threshold = 5;
        let perP = this.over*(slagen - threshold) + (slagen >= threshold ? this.base : -this.base);
        if(slagen == 13 || slagen == 0) perP *= 2;
        return this.perPlayerToScoreDelta(perP, goingPlayers, deler);
    }

    renderSlagenSelector(htmlId: string){
        this.slagenSelector.render(htmlId);
    }
}