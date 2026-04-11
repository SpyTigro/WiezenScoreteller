import ActionMode from "./actionSelector/ActionMode.js";
import MiserieMode from "./actionSelector/MiserieMode.js";
import ActionSelector from "./actionSelector/ActionSelector.js";
import HistoryTable from "./historyTable/HistoryTable.js";
import ModeInitializer from "./Initializers/ModeInitializer.js";
import PlayerInitializer from "./Initializers/PlayerInitializer.js";
import StandardMode from "./actionSelector/StandardMode.js";

let PS: PlayerInitializer, MS: ModeInitializer, ST: HistoryTable, AS: ActionSelector;
let players = new Array<string>;
let modes = new Array<ActionMode>;
let scores = new Array<number>;

window.onload = function () {
    PS = new PlayerInitializer('PlayerSelector', 5, 4);
    MS = new ModeInitializer('ModeSelector', [new StandardMode('Standaard', 2, 1),
                                              new MiserieMode('Miserie', 10),
                                              new MiserieMode('Open Miserie', 20),
                                              ]);
    let actionBtn = document.getElementById('ActionButton');
    if (actionBtn) actionBtn.addEventListener('click', actionBtnClickHandler);
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

        ST = new HistoryTable('ScoreTable', players);

        players.forEach(p => scores.push(0));
        ST.addEntry(scores);

        AS = new ActionSelector('ActionSelector', players, modes, PS.getDeler());

        actionBtn.innerText = 'Calc and Add Score';
    }
    catch (e) {
        alert(e);
        PS = new PlayerInitializer('PlayerSelector', 5, 4);
    }
    return;
}

function calc() {
    let deltaScores = Array<number>;
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