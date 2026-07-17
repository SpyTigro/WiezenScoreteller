import { addArrays } from "./Util.js";
export class RoundType {
    constructor(typeId, base, threshold, options, minP = 1, maxP = 4) {
        this.typeId = typeId;
        this.base = base;
        this.over = options.over ? options.over : 0;
        this.loseMod = options.loseMod === undefined ? 1 : options.loseMod;
        this.kaputMod = options.kaputMod === undefined ? 1 : options.kaputMod;
        this.threshold = threshold;
        this.thresholdSolo = options.thresholdSolo;
        this.reverse = options.reverseThreshold === undefined ? false : options.reverseThreshold;
        this.minP = minP;
        this.maxP = maxP;
        this.teamed = options.teamed === undefined ? true : options.teamed;
        this.overTrul = options.overTrul === undefined ? false : options.overTrul;
    }
    getScoresDelta(roundResult) {
        let count = this.getAndCheckTeamACount(roundResult.teamA);
        if (roundResult.trul && !this.overTrul)
            throw new Error('This type of round can\'t be played over trul');
        let threshold = this.threshold;
        if (count == 1 && this.thresholdSolo)
            threshold = this.thresholdSolo;
        let delta = [0, 0, 0, 0];
        if (this.teamed) {
            let perP = this.getPerPlayerForOneTeam(roundResult.hits[0], threshold, roundResult.trul);
            delta = this.perPlayerToScoreDelta(perP, roundResult.teamA, count);
        }
        else {
            roundResult.teamA.forEach((p, i) => {
                let perP = this.getPerPlayerForOneTeam(roundResult.hits[0], threshold, roundResult.trul);
                let team = [false, false, false, false];
                team[i] = true;
                delta = addArrays(delta, this.perPlayerToScoreDelta(perP, team, 1));
            });
        }
        return delta;
    }
    getPerPlayerForOneTeam(teamScore, threshold, trul) {
        let won = this.reverse ? !(teamScore < threshold) : teamScore < threshold;
        let perP = (teamScore - threshold) * this.over * (this.reverse ? -1 : 1) + (won ? this.base : -this.base);
        if (won && (teamScore == (this.reverse ? 0 : 13) || trul))
            perP *= Math.max(this.kaputMod, 2);
        else if (!won)
            perP *= this.loseMod;
        return perP;
    }
    perPlayerToScoreDelta(perP, team, count) {
        let scores = [];
        for (let i = 0; i < team.length; i++) {
            if (team[i]) {
                scores[i] = perP;
                if (count == 1)
                    scores[i] += 2 * perP;
            }
            else
                scores[i] = -perP;
        }
        return scores;
    }
    getAndCheckTeamACount(teamA) {
        let count = 0;
        for (let i = 0; i < teamA.length; i++) {
            if (teamA[i])
                count++;
        }
        if (this.minP > count || this.maxP < count)
            throw new Error(`Spelers die gaan moeten tussen ${this.minP} en ${this.maxP} liggen`);
        return count;
    }
}
