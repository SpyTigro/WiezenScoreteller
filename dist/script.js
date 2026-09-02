import PlayerInitializer from "./Initializers/PlayerInitializer.js";
import { RoundTypeInitializer } from "./Initializers/RoundTypeInitializer.js";
import ActionSelector from "./actionSelector/ActionSelector.js";
import HistoryTable from "./historyTable/HistoryTable.js";
import { Game } from "./Game/Game.js";
import { RoundType } from "./Game/RoundType.js";
let game, PS, RTI, ST, AS;
let players = new Array;
let roundTypes = [new RoundType('Standaard', 2, 8, { over: 1, thresholdSolo: 5, kaputMod: 1.4, loseMod: 2, overTrul: true, reverseThreshold: false, minP: 1, maxP: 2 }),
    new RoundType('Miserie', 5, 0, { reverseThreshold: true, teamed: false, minP: 1, maxP: 4 }),
    new RoundType('Open Miserie', 10, 0, { reverseThreshold: true, teamed: false, overTrul: true, minP: 1, maxP: 4 }),
    new RoundType('Negen', 5, 9, { maxP: 1, teamed: false }),
    new RoundType('Solo', 15, 13, { maxP: 1, teamed: false, overTrul: true })
];
let scores = new Array;
let loadedFile = undefined;
let actionBtn, removeLastBtn, saveloadBtn, fileInEl, fileInDiv;
window.onload = function () {
    PS = new PlayerInitializer('PlayerSelector', 5, 4);
    RTI = new RoundTypeInitializer('ModeSelector', roundTypes);
    actionBtn = document.getElementById('ActionButton');
    if (actionBtn)
        actionBtn.addEventListener('click', actionBtnClickHandler);
    removeLastBtn = document.getElementById('RemoveLast');
    if (removeLastBtn)
        removeLastBtn.addEventListener('click', removeLastBtnClickHandler);
    saveloadBtn = document.getElementById('SaveLoadBtn');
    if (saveloadBtn)
        saveloadBtn.addEventListener('click', saveLoadBtnClickHandler);
    fileInEl = document.getElementById('fileLoadInput');
    if (fileInEl)
        fileInEl.addEventListener('change', e => {
            if (fileInEl.files) {
                let fileLoadLabel = document.getElementById('fileLoadLabel');
                if (fileLoadLabel)
                    fileLoadLabel.innerHTML = fileInEl.files[0].name;
            }
        });
    fileInDiv = document.getElementById('fileLoad');
};
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});
function removeLastBtnClickHandler(e) {
    if (ST && confirm('are you sure you want to delete, you cant reverse this action')) {
        ST.removeLast();
        if (game) {
            game.removeRound();
            AS = new ActionSelector('ActionSelector', game);
        }
        if (PS)
            PS.previousDeler();
    }
}
function actionBtnClickHandler(e) {
    const actionBtn = e.currentTarget;
    if (actionBtn.innerHTML == 'Start')
        start(actionBtn);
    else
        calc();
}
function start(actionBtn) {
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
        roundTypes = RTI.lock();
        console.log(roundTypes);
        if (ST) {
            game = new Game(players, roundTypes, PS.getDeler(), ST.getTable());
        }
        else {
            game = new Game(players, roundTypes, PS.getDeler());
            ST = new HistoryTable('ScoreTable', players);
        }
        AS = new ActionSelector('ActionSelector', game);
        if (actionBtn)
            actionBtn.innerHTML = 'Calc and add score';
        if (saveloadBtn)
            saveloadBtn.innerHTML = 'Save';
        if (fileInDiv)
            fileInDiv.hidden = true;
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
function saveLoadBtnClickHandler(e) {
    const btn = e.currentTarget;
    if (btn.innerHTML == 'Load')
        load(btn);
    else
        save();
}
function save() {
    let saveObj = {
        players: players,
        types: roundTypes,
        deler: game.deler,
        scoreTable: game.scores,
    };
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
        }).then((handle) => {
            return handle.createWritable();
        }).then((writable) => {
            return writable.write(jsonStr).then(() => writable.close());
        }).catch((err) => {
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
function load(btn) {
    if (!fileInEl)
        return;
    const file = fileInEl.files ? fileInEl.files[0] : undefined;
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = (e) => {
        var _a;
        try {
            const text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            console.log(text);
            let loadObj = JSON.parse(text);
            if (!loadObj.players || !loadObj.scoreTable || loadObj.deler == undefined) {
                alert('invalid file');
                return;
            }
            players = loadObj.players;
            PS.setPlayers(players);
            PS.setDeler(loadObj.deler);
            if (loadObj.types)
                roundTypes = loadObj.types;
            RTI = new RoundTypeInitializer('ModeSelector', roundTypes);
            let tempScores = loadObj.scoreTable;
            ST = new HistoryTable('ScoreTable', players, tempScores);
            loadedFile = file;
        }
        catch (er) {
            alert(er);
            return;
        }
    };
    reader.onerror = () => {
        alert('Error reading file.');
    };
    reader.readAsText(file);
}
