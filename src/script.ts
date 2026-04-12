
import PlayerInitializer from "./Initializers/PlayerInitializer.js";
import ModeInitializer from "./Initializers/ModeInitializer.js";

import ActionSelector from "./actionSelector/ActionSelector.js";

import HistoryTable from "./historyTable/HistoryTable.js";

import ActionMode from "./actionSelector/ActionMode.js";
import StandardMode from "./actionSelector/StandardMode.js";
import MiserieMode from "./actionSelector/MiserieMode.js";
import AbondanceMode from "./actionSelector/AbondanceMode.js";

let PS: PlayerInitializer, MS: ModeInitializer, ST: HistoryTable<number>, AS: ActionSelector;
let players = new Array<string>;
let modes = new Array<ActionMode>;
let scores = new Array<number>;

let loadedFile = undefined;

window.onload = function () {
    PS = new PlayerInitializer('PlayerSelector', 5, 4);
    MS = new ModeInitializer('ModeSelector', [new StandardMode('Standaard', 2, 1),
    new MiserieMode('Miserie', 5),
    new MiserieMode('Open Miserie', 10),
    new AbondanceMode('Negen', 9, 5),
    new AbondanceMode('Tien', 10, 5),
    new AbondanceMode('Elf', 11, 5),
    new AbondanceMode('Twaalf', 12, 5),
    new AbondanceMode('Solo', 13, 15),
    ]);
    let actionBtn = document.getElementById('ActionButton');
    if (actionBtn) actionBtn.addEventListener('click', actionBtnClickHandler);
    let saveloadBtn = document.getElementById('SaveLoadBtn');
    if (saveloadBtn) saveloadBtn.addEventListener('click', saveLoadBtnClickHandler);
}

function actionBtnClickHandler(e: Event) {
    const actionBtn = e.currentTarget as HTMLElement;
    if (actionBtn.innerText == 'Start') start(actionBtn);
    else calc();
}

function start(actionBtn: HTMLElement) {
    try {
        players = PS.lock();
        modes = MS.lock();

        ST = new HistoryTable<number>('ScoreTable', players);

        players.forEach(p => scores.push(0));
        ST.addEntry(scores);

        AS = new ActionSelector('ActionSelector', players, modes, PS.getDeler());

        actionBtn.innerText = 'Calc and Add Score';

        let saveloadBtn = document.getElementById('SaveLoadBtn');
        if (saveloadBtn) saveloadBtn.innerText = 'Save';
    }
    catch (e) {
        alert(e);
        PS = new PlayerInitializer('PlayerSelector', 5, 4);
    }
    return;
}

function calc() {
    try {
        let deltaScores = AS.getScoreDelta();

        for (let i = 0; i < scores.length; i++) {
            scores[i] += deltaScores[i];
        }
        ST.addEntry(scores);
        return;
    }
    catch (e) {
        alert(e);
        return;
    }
}

function saveLoadBtnClickHandler(e: Event) {
    const btn = e.currentTarget as HTMLElement;
    if (btn.innerText == 'Load') load(btn);
    else save();
}

function save() {
    let saveObj = {
        players: players,
        deler: AS.getDeler(),
        modes: modes,
        scoreTable: ST.getTable(),
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
    } else {
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
}

function load(btn: HTMLElement) {
    let fileInEl = document.getElementById('fileLoad') as HTMLInputElement;
    if (!fileInEl) return;

    if (!fileInEl.files) return;
    const file = fileInEl.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            console.log(text);
            let loadObj = JSON.parse(text);
            if (!loadObj.players || !loadObj.modes || !loadObj.scoreTable || !loadObj.deler) {
                alert('invalid file');
                return;
            }
            players = loadObj.players;
            modes = loadObj.modes;
            let tempScores = loadObj.scoreTable as Array<Array<number>>;

            ST = new HistoryTable<number>('ScoreTable', players);

            tempScores.forEach(e => ST.addEntry(e));

            AS = new ActionSelector('ActionSelector', players, modes, loadObj.deler);

            let actionBtn = document.getElementById('ActionButton');
            if (actionBtn) actionBtn.innerText = 'Calc and Add Score';

            let saveloadBtn = document.getElementById('SaveLoadBtn');
            if (saveloadBtn) saveloadBtn.innerText = 'Save';

            fileInEl.hidden = true;

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