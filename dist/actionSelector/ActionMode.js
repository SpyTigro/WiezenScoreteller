export default class ActionMode {
    constructor(name, threshold, base, overslag, minPlayers = 1, maxPlayers = minPlayers) {
        this.name = name;
        this.threshold = threshold;
        this.base = base;
        this.over = overslag;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }
    addArrays(arr1, arr2) {
        let arr = Array(Math.max(arr1.length, arr2.length));
        for (let i = 0; i < arr.length; i++) {
            if (!arr1[i]) {
                arr[i] = arr2[i];
                continue;
            }
            if (!arr2[i]) {
                arr[i] = arr1[i];
                continue;
            }
            arr[i] = arr1[i] + arr2[i];
        }
        return arr;
    }
    getAndCheckGoingPlayerCount(goingPlayers, deler) {
        let goingCount = 0;
        for (let i = 0; i < goingPlayers.length; i++) {
            if (goingPlayers.length == 5 && deler == i)
                continue;
            if (goingPlayers[i])
                goingCount++;
        }
        if (goingCount < 1)
            throw new Error('Er gaat niemand??');
        if (this.minPlayers > goingCount || this.maxPlayers < goingCount)
            throw new Error(`Spelers die gaan moeten tussen ${this.minPlayers} en ${this.maxPlayers} liggen`);
        return goingCount;
    }
    perPlayerToScoreDelta(perP, goingPlayers, deler) {
        let goingCount = this.getAndCheckGoingPlayerCount(goingPlayers, deler);
        let scores = [];
        for (let i = 0; i < goingPlayers.length; i++) {
            if (goingPlayers[i]) {
                scores[i] = perP;
                if (goingCount == 1)
                    scores[i] += 2 * perP;
            }
            else
                scores[i] = -perP;
        }
        if (goingPlayers.length == 5)
            scores[deler] = 0;
        return scores;
    }
}
