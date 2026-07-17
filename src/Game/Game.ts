import { RoundResult } from "./RoundResult.js";
import { RoundType } from "./RoundType.js";
import { addArrays } from "./Util.js";

export class Game {
    private players: Array<string>;
    private currentScores: Array<number>;
    private deler: number;

    private roundTypes: Array<RoundType>;

    private rounds: Array<RoundResult> = new Array<RoundResult>();
    private scoreTable: Array<Array<number>> = new Array<Array<number>>;
    
    constructor(players: Array<string>, roundTypes: Array<RoundType>, deler: number = 0) {
        if (players.length < 4 || players.length > 5) throw new Error('Too many players');

        this.players = players;
        this.currentScores = new Array<number>(players.length);
        this.deler = deler;

        this.roundTypes = roundTypes;
    }

    addRound(roundResult: RoundResult) {
        if (roundResult.teamA.length != 4) throw new Error('Incorrect size of teamA array');

        this.rounds.push(roundResult);
        this.currentScores = this.newScores(roundResult);
        this.scoreTable.push(this.currentScores);

        this.deler = (this.deler + 1) % this.players.length;
    }

    removeRound() {
        let roundResult = this.rounds.pop();
        if (!roundResult) return;

        this.scoreTable.pop();
        this.currentScores = this.scoreTable[this.scoreTable.length - 1];

        this.deler = (this.deler - 1) % this.players.length;
    }

    private newScores(roundResult: RoundResult): number[] {
        let delta = this.getRoundType(roundResult.typeId).getScoresDelta(roundResult);
        delta.splice(this.deler, 0, 0);
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