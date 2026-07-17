export default abstract class ActionMode{
    readonly name: string;
    readonly threshold: number;
    readonly base: number;
    readonly over: number;
    readonly minPlayers: number;
    readonly maxPlayers: number;
    
    constructor(name: string, threshold: number, base: number, overslag: number, minPlayers: number = 1, maxPlayers: number = minPlayers){
        this.name = name;
        this.threshold = threshold;
        this.base = base;
        this.over = overslag;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    abstract getScoreDelta(goingPlayers: Array<boolean>, deler: number, trul: boolean): Array<number>;

    abstract renderSlagenSelector(htmlId: string, players: Array<string>): void;

    abstract clone(name: string, base: number, overslag: number): ActionMode;

    protected addArrays(arr1: Array<number>, arr2: Array<number>): Array<number>{
        let arr = Array<number>(Math.max(arr1.length, arr2.length));
        for(let i = 0; i< arr.length; i++){
            if(!arr1[i]) {
                arr[i] = arr2[i];
                continue;
            }
            if(!arr2[i]) {
                arr[i] = arr1[i];
                continue;
            }
            arr[i] = arr1[i] + arr2[i];
        }
        return arr;
    }

    protected getAndCheckGoingPlayerCount(goingPlayers: Array<boolean>, deler: number): number{
        let goingCount = 0;
        for (let i = 0; i < goingPlayers.length; i++) {
            if(goingPlayers.length == 5 && deler == i) continue;
            if(goingPlayers[i]) goingCount++;
        }
        if (goingCount < 1) throw new Error('Er gaat niemand??');
        if (this.minPlayers > goingCount || this.maxPlayers < goingCount) throw new Error(`Spelers die gaan moeten tussen ${this.minPlayers} en ${this.maxPlayers} liggen`);
        return goingCount;
    }

    protected perPlayerToScoreDelta(perP: number, goingPlayers: Array<boolean>, deler: number){
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);

        let scores = [];
        for (let i = 0; i < goingPlayers.length; i++) {
            if (goingPlayers[i]) {
                scores[i] = perP;
                if (goingCount == 1) scores[i] += 2 * perP;
            }
            else
                scores[i] = -perP;
        }
        if(goingPlayers.length == 5) scores[deler] = 0;
        return scores;
    }
}