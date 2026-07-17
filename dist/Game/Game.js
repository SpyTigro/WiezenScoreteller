import { addArrays } from "./Util.js";
export class Game {
    constructor(players, roundTypes, deler = 0) {
        this.rounds = new Array();
        this.scoreTable = new Array;
        if (players.length < 4 || players.length > 5)
            throw new Error('Too many players');
        this.players = players;
        this.currentScores = new Array(players.length);
        this.deler = deler;
        this.roundTypes = roundTypes;
    }
    addRound(roundResult) {
        if (roundResult.teamA.length != 4)
            throw new Error('Incorrect size of teamA array');
        this.rounds.push(roundResult);
        this.currentScores = this.newScores(roundResult);
        this.scoreTable.push(this.currentScores);
        this.deler = (this.deler + 1) % this.players.length;
    }
    removeRound() {
        let roundResult = this.rounds.pop();
        if (!roundResult)
            return;
        this.scoreTable.pop();
        this.currentScores = this.scoreTable[this.scoreTable.length - 1];
        this.deler = (this.deler - 1) % this.players.length;
    }
    newScores(roundResult) {
        let delta = this.getRoundType(roundResult.typeId).getScoresDelta(roundResult);
        delta.splice(this.deler, 0, 0);
        let newScores = addArrays(this.currentScores, delta);
        return newScores;
    }
    getRoundType(typeId) {
        for (let type of this.roundTypes) {
            if (type.typeId == typeId)
                return type;
        }
        throw new Error('No type with this Id');
    }
}
