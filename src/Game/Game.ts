import { RoundResult } from "./RoundResult.js";
import { RoundType } from "./RoundType.js";
import { addArrays } from "./Util.js";

export class Game {
    readonly players: Array<string>;
    private currentScores: Array<number>;
    private _deler: number;

    readonly roundTypes: Array<RoundType>;

    private rounds: Array<RoundResult> = new Array<RoundResult>();
    private scoreTable: Array<Array<number>> = new Array<Array<number>>;
    
    get deler(): number { 
        return this._deler 
    }

    get scores(): Array<Array<number>>{
        return this.scoreTable;
    }

    get currentScore(): Array<number> {
        return this.currentScores;
    }

    constructor(players: Array<string>, roundTypes: Array<RoundType>, deler: number = 0, scoreTable?: Array<Array<number>>) {
        if (players.length < 4 || players.length > 5) throw new Error('Too many players');

        this.players = players;
        this._deler = deler;

        if(scoreTable){
            this.scoreTable = scoreTable
            this.currentScores = scoreTable[scoreTable.length - 1];
        }
        else 
            this.currentScores = new Array<number>(players.length);

        this.roundTypes = roundTypes;
    }
    
    set deler(deler: number) {
        this._deler = deler % this.players.length
    }

    addRound(roundResult: RoundResult) {
        if (roundResult.teamA.length != 4) throw new Error('Incorrect size of teamA array');

        this.rounds.push(roundResult);
        this.currentScores = this.newScores(roundResult);
        this.scoreTable.push(this.currentScores);

        this._deler = (this._deler + 1) % this.players.length;
    }

    removeRound() {
        let roundResult = this.rounds.pop();
        if (!roundResult) return;

        this.scoreTable.pop();
        this.currentScores = this.scoreTable[this.scoreTable.length - 1];

        this._deler = (this._deler - 1) % this.players.length;
    }

    private newScores(roundResult: RoundResult): number[] {
        let delta = this.getRoundType(roundResult.typeId).getScoresDelta(roundResult);
        if(this.players.length == 5) delta.splice(this._deler, 0, 0);
        let newScores = addArrays(this.currentScores, delta);
        return newScores;
    }

    private getRoundType(typeId: string): RoundType {
        for (let type of this.roundTypes) {
            if (type.typeId == typeId) return type;
        }
        throw new Error('No type with this Id');
    }
}