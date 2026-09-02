import { addArrays } from "./Util.js";
export class Game {
    get deler() {
        return this._deler;
    }
    get scores() {
        return this.scoreTable;
    }
    get currentScore() {
        return this.currentScores;
    }
    constructor(players, roundTypes, deler = 0, scoreTable) {
        //private rounds: Array<RoundResult> = new Array<RoundResult>();
        this.scoreTable = new Array;
        if (players.length < 4 || players.length > 5)
            throw new Error('Too many players');
        this.players = players;
        this._deler = deler;
        if (scoreTable) {
            this.scoreTable = scoreTable;
            this.currentScores = scoreTable[scoreTable.length - 1];
        }
        else
            this.currentScores = new Array(players.length);
        this.roundTypes = roundTypes;
    }
    set deler(deler) {
        this._deler = deler % this.players.length;
    }
    addRound(roundResult) {
        if (roundResult.teamA.length != 4)
            throw new Error('Incorrect size of teamA array');
        // this.rounds.push(roundResult);
        this.currentScores = this.newScores(roundResult);
        this.scoreTable.push(this.currentScores);
        this._deler = (this._deler + 1) % this.players.length;
    }
    removeRound() {
        // let roundResult = this.rounds.pop();
        // if (!roundResult) return;
        let oldScore = this.scoreTable.pop();
        if (!oldScore)
            return;
        this.currentScores = this.scoreTable[this.scoreTable.length - 1];
        this._deler = (this._deler - 1) % this.players.length;
    }
    newScores(roundResult) {
        let delta = this.getRoundType(roundResult.typeId).getScoresDelta(roundResult);
        if (this.players.length == 5)
            delta.splice(this._deler, 0, 0);
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
