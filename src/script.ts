
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
let modes: Array<ActionMode> = [new StandardMode('Standaard', 2, 1),
new MiserieMode('Miserie', 5),
new MiserieMode('Open Miserie', 10),
new AbondanceMode('Negen', 9, 5),
new AbondanceMode('Tien', 10, 5),
new AbondanceMode('Elf', 11, 5),
new AbondanceMode('Twaalf', 12, 5),
new AbondanceMode('Solo', 13, 15),
];
let scores = new Array<number>;

let loadedFile: File | undefined = undefined;

let actionBtn: HTMLButtonElement,
    saveloadBtn: HTMLButtonElement,
    fileInEl: HTMLInputElement,
    fileInDiv: HTMLDivElement;

window.onload = function () {
    PS = new PlayerInitializer('PlayerSelector', 5, 4);
    MS = new ModeInitializer('ModeSelector', modes);

    actionBtn = document.getElementById('ActionButton') as HTMLButtonElement;
    if (actionBtn) actionBtn.addEventListener('click', actionBtnClickHandler);
    saveloadBtn = document.getElementById('SaveLoadBtn') as HTMLButtonElement;
    if (saveloadBtn) saveloadBtn.addEventListener('click', saveLoadBtnClickHandler);

    fileInEl = document.getElementById('fileLoadInput') as HTMLInputElement;
    if (fileInEl) fileInEl.addEventListener('change', e => {
        if (fileInEl.files) {
            let fileLoadLabel = document.getElementById('fileLoadLabel');
            if (fileLoadLabel)
                fileLoadLabel.innerText = fileInEl.files[0].name;
        }
    })

    fileInDiv = document.getElementById('fileLoad') as HTMLDivElement;
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

        if (!ST) {
            ST = new HistoryTable<number>('ScoreTable', players);

            players.forEach(p => scores.push(0));
            ST.addEntry(scores);
        }
        AS = new ActionSelector('ActionSelector', players, modes, PS.getDeler());

        if(actionBtn) actionBtn.innerText = 'Calc and Add Score';

        if(saveloadBtn) saveloadBtn.innerText = 'Save';

        if(fileInDiv) fileInDiv.hidden = true;
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
        modes: modes,
        deler: PS.getDeler(),
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

    const file = fileInEl.files? fileInEl.files[0]: undefined;
    if(!file) return;
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

            players = loadObj.players
            PS.setPlayers(players);
            PS.setDeler(loadObj.deler);

            for (let i = 0; i < modes.length; i++) {
                let loadedMode = loadObj.modes[i]
                modes[i] = modes[i].clone(loadedMode.name, loadedMode.base, loadedMode.over);
            }
            MS = new ModeInitializer('ModeSelector', modes);

            let tempScores = loadObj.scoreTable as Array<Array<number>>;

            ST = new HistoryTable<number>('ScoreTable', players);

            tempScores.forEach(e => ST.addEntry(e));
            scores = tempScores[tempScores.length - 1];

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