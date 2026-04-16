import ActionMode from "./ActionMode.js";
import MiserieSlagenSelector from "./MiserieSlagenSelector.js";

export default class MiserieMode extends ActionMode {
    private slagenSelector: MiserieSlagenSelector = new MiserieSlagenSelector();

    constructor(name: string, base: number) {
        super(name, 0, base, 0, 1, 4);
    }

    clone(name: string = this.name, base: number = this.base): ActionMode{
        return new MiserieMode(name, base);
    }

    getScoreDelta(goingPlayers: Array<boolean>, deler: number, trul: boolean): Array<number> {
        this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        let scoreDelta = new Array<number>(goingPlayers.length);
        let fiveP = goingPlayers.length == 5;
        let succeeds = this.slagenSelector.getSucceeds();

        for (let i = 0; i < goingPlayers.length; i++) {
            if (fiveP && i == deler) continue;
            if (goingPlayers[i]) {
                let perP = succeeds[!fiveP || i < deler ? i : i - 1] ? this.base : -this.base;
                if(trul) perP *= 2;
                let score = Array<number>(goingPlayers.length);
                for(let j = 0; j < goingPlayers.length; j++){
                    if(i == j) score[j] = 3*perP;
                    else score[j] = -perP;
                }
                if(fiveP) score[deler] = 0;
                scoreDelta = this.addArrays(scoreDelta, score);
            }
        }

        return scoreDelta;
    }

    renderSlagenSelector(htmlId: string, players: Array<string>) {
        this.slagenSelector.render(htmlId, players);
    }
}