
import PlayerInitializer from "./Initializers/PlayerInitializer.js";
import { RoundTypeInitializer } from "./Initializers/RoundTypeInitializer.js";

import ActionSelector from "./actionSelector/ActionSelector.js";

import HistoryTable from "./historyTable/HistoryTable.js";

import { Game } from "./Game/Game.js";
import { RoundType } from "./Game/RoundType.js";

let game: Game,
    PS: PlayerInitializer,
    RTI: RoundTypeInitializer,
    ST: HistoryTable<number>,
    AS: ActionSelector;

let players = new Array<string>;
let roundTypes: Array<RoundType> = 
    [new RoundType('Standaard', 2, 8, {over: 1, thresholdSolo: 5, teamed: true, kaputMod: 1.4, loseMod: 2, overTrul: true, reverseThreshold: false, minP: 1, maxP : 2}),
    new RoundType('Miserie', 5, 0, {reverseThreshold: true, teamed: false, minP: 1, maxP: 4}),
    new RoundType('Open Miserie', 10, 0, {reverseThreshold: true, teamed: false, overTrul: true, minP: 1, maxP: 4})
];
let scores = new Array<number>;

let loadedFile: File | undefined = undefined;

let actionBtn: HTMLButtonElement,
    removeLastBtn: HTMLButtonElement,
    saveloadBtn: HTMLButtonElement,
    fileInEl: HTMLInputElement,
    fileInDiv: HTMLDivElement;

window.onload = function () {
    PS = new PlayerInitializer('PlayerSelector', 5, 4);
    RTI = new RoundTypeInitializer('ModeSelector', roundTypes);

    actionBtn = document.getElementById('ActionButton') as HTMLButtonElement;
    if (actionBtn) actionBtn.addEventListener('click', actionBtnClickHandler);
    removeLastBtn = document.getElementById('RemoveLast') as HTMLButtonElement;
    if (removeLastBtn) removeLastBtn.addEventListener('click', removeLastBtnClickHandler);
    saveloadBtn = document.getElementById('SaveLoadBtn') as HTMLButtonElement;
    if (saveloadBtn) saveloadBtn.addEventListener('click', saveLoadBtnClickHandler);

    fileInEl = document.getElementById('fileLoadInput') as HTMLInputElement;
    if (fileInEl) fileInEl.addEventListener('change', e => {
        if (fileInEl.files) {
            let fileLoadLabel = document.getElementById('fileLoadLabel');
            if (fileLoadLabel)
                fileLoadLabel.innerHTML = fileInEl.files[0].name;
        }
    })

    fileInDiv = document.getElementById('fileLoad') as HTMLDivElement;
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();

    e.returnValue = '';
});

function removeLastBtnClickHandler(e: Event) {
    if (ST && confirm('are you sure you want to delete, you cant reverse this action')) {
        ST.removeLast();
        if (game) game.removeRound();
        if (PS) PS.previousDeler();
    }
}

function actionBtnClickHandler(e: Event) {
    const actionBtn = e.currentTarget as HTMLElement;
    if (actionBtn.innerHTML == 'Start') start(actionBtn);
    else calc();
}

function start(actionBtn: HTMLElement) {
    try {
        let newPlayers = PS.lock();
        let playersChanged = false;
        if (players.length != newPlayers.length)
            playersChanged = true;
        else
            for (let i = 0; i < players.length && !playersChanged; i++)
                if (newPlayers[i] != players[i])
                    playersChanged = true;

        players = newPlayers;

        roundTypes = RTI.lock()
        console.log(roundTypes);

        if(ST){
            game = new Game(players, roundTypes, PS.getDeler(), ST.getTable());
        } else
        game = new Game(players, roundTypes, PS.getDeler());

        AS = new ActionSelector('ActionSelector', game);

        ST = new HistoryTable('ScoreTable', players, game.scores);

        if (actionBtn) actionBtn.innerHTML = 'Calc and add score';

        if (saveloadBtn) saveloadBtn.innerHTML = 'Save';

        if (fileInDiv) fileInDiv.hidden = true;
    }
    catch (e) {
        alert(e);
        PS = new PlayerInitializer('PlayerSelector', 5, 4);
    }
    return;
}

function calc() {
    try {
        let roundResult = AS.roundResult;

        game.addRound(roundResult);

        AS = new ActionSelector('ActionSelector', game);
        ST.addEntry(game.currentScore);
        return;
    }
    catch (e) {
        alert(e);
        return;
    }
}

function saveLoadBtnClickHandler(e: Event) {
    const btn = e.currentTarget as HTMLElement;
    if (btn.innerHTML == 'Load') load(btn);
    else save();
}

function save() {
    let saveObj = {
        players: players,
        types: roundTypes,
        deler: game.deler,
        scoreTable: game.scores,
    }

    let jsonStr = JSON.stringify(saveObj);

    // Try File System Access API if available
    // @ts-ignore
    if (window.showSaveFilePicker) {
        // @ts-ignore
        window.showSaveFilePicker({
            suggestedName: 'wiezen_score.json',
            types: [
                {
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                },
            ],
        }).then((handle: any) => {
            return handle.createWritable();
        }).then((writable: any) => {
            return writable.write(jsonStr).then(() => writable.close());
        }).catch((err: any) => {
            alert('Save cancelled or failed.');
        });
        return;
    }
    // Fallback: download as file
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wiezen_score.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

function load(btn: HTMLElement) {
    if (!fileInEl) return;

    const file = fileInEl.files ? fileInEl.files[0] : undefined;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            console.log(text);
            let loadObj = JSON.parse(text);
            if (!loadObj.players || !loadObj.scoreTable || loadObj.deler == undefined) {
                alert('invalid file');
                return;
            }

            players = loadObj.players
            PS.setPlayers(players);
            PS.setDeler(loadObj.deler);

            if(loadObj.types)
                roundTypes = loadObj.types;
            RTI = new RoundTypeInitializer('ModeSelector', roundTypes);

            let tempScores = loadObj.scoreTable as Array<Array<number>>;

            ST = new HistoryTable<number>('ScoreTable', players, tempScores);

            loadedFile = file;
        } catch (er) {
            alert(er);
            return
        }
    };
    reader.onerror = () => {
        alert('Error reading file.');
    };
    reader.readAsText(file);
}