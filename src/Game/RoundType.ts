import { RoundResult } from "./RoundResult.js";
import { addArrays } from "./Util.js";

export type RoundTypeOptions = { over?: number, loseMod?: number, kaputMod?: number, thresholdSolo?: number, reverseThreshold?: boolean, teamed?: boolean, overTrul?: boolean, minP?: number, maxP?: number}

export const roundTypeOptionKeys = [
  'Over',
  'Lose Mult',
  'Kaput Mult',
  'Threshold Solo',
  'Reverse Threshold',
  'In Teams',
  'Works in Trul',
  'Min #Players',
  'Max #Players'
];

export class RoundType {
    readonly typeId: string;

    readonly base: number;
    readonly over: number;
    readonly loseMod: number;
    readonly kaputMod: number;

    readonly threshold: number;
    readonly thresholdSolo: number;
    readonly reverse: boolean;

    readonly minP: number;
    readonly maxP: number;

    readonly teamed: boolean;
    readonly overTrul: boolean;

    constructor(typeId: string, base: number, threshold: number, options: RoundTypeOptions) {
        this.typeId = typeId;

        this.base = base;
        this.over = options.over ? options.over : 0;
        this.loseMod = options.loseMod === undefined ? 1 : options.loseMod;
        this.kaputMod = options.kaputMod === undefined ? 1 : options.kaputMod;

        this.threshold = threshold;
        this.thresholdSolo = options.thresholdSolo === undefined ? threshold : options.thresholdSolo;
        this.reverse = options.reverseThreshold === undefined ? false : options.reverseThreshold;

        this.minP = options.minP === undefined ? 1 : options.minP;
        this.maxP = options.maxP === undefined ? 1 : options.maxP;

        this.teamed = options.teamed === undefined ? true : options.teamed;
        this.overTrul = options.overTrul === undefined ? false : options.overTrul;
    }

    getScoresDelta(roundResult: RoundResult): Array<number> {
        if (roundResult.trul && !this.overTrul) throw new Error('This type of round can\'t be played over trul');

        let count = this.getAndCheckTeamACount(roundResult.teamA);
        let threshold = this.threshold;
        if (count == 1 && this.thresholdSolo) threshold = this.thresholdSolo;

        let delta: Array<number> = [0,0,0,0];
        if (this.teamed) {
            let perP = this.getPerPlayerForOneTeam(roundResult.hits[0], threshold, roundResult.trul);
            delta = this.perPlayerToScoreDelta(perP, roundResult.teamA, count);
        }
        else {
            let j = 0
            roundResult.teamA.forEach((p, i) => {
                let perP = this.getPerPlayerForOneTeam(roundResult.hits[j], threshold, roundResult.trul);
                j++;
                let team = [false, false, false, false]
                team[i] = true;
                delta = addArrays(delta, this.perPlayerToScoreDelta(perP, team, 1));
            })
        }

        return delta;
    }

    private getPerPlayerForOneTeam(teamScore: number, threshold: number, trul: boolean): number {
        let won = this.reverse ? teamScore <= threshold : teamScore >= threshold;

        let perP =  (this.reverse ? -1 : 1) * (teamScore - threshold) * this.over  + (won ? this.base : -this.base);

        if (won) {
            if(teamScore == (this.reverse ? 0 : 13)) perP *= this.kaputMod;
            if(trul) perP *= 2;
        }
        else {
            if(trul) perP *= Math.max(this.loseMod, 2);
            else perP *= this.loseMod;
        }


        return Math.round(perP);
    }

    private perPlayerToScoreDelta(perP: number, team: Array<boolean>, count: number): number[] {
        let scores = [];
        for (let i = 0; i < team.length; i++) {
            if (team[i]) {
                scores[i] = perP;
                if (count == 1) scores[i] += 2 * perP;
            }
            else
                scores[i] = -perP;
        }
        return scores;
    }

    private getAndCheckTeamACount(teamA: Array<boolean>): number {
        let count = 0;
        for (let i = 0; i < teamA.length; i++) {
            if (teamA[i]) count++;
        }
        if (this.minP > count || this.maxP < count) throw new Error(`Spelers die gaan moeten tussen ${this.minP} en ${this.maxP} liggen`);
        return count;
    }

}