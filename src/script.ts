import ActionSelector from "./actionSelector/ActionSelector.js";
import HistoryTable from "./historyTable/HistoryTable.js";
import PlayerSelector from "./playerSelector/PlayerSelector.js";

let PS: PlayerSelector, ST: HistoryTable, AS: ActionSelector;
let players = new Array<string>;
let Scores = new Array<number>;

window.onload = function () {
    PS = new PlayerSelector('PlayerSelector', 5, 4);
    let actionBtn = document.getElementById('ActionButton');
    if (actionBtn) actionBtn.addEventListener('click', actionBtnClickHandler);
}

function actionBtnClickHandler(e: Event) {
    const actionBtn = e.currentTarget as HTMLElement;
    if(actionBtn.innerText == 'Start') start(actionBtn);
    else calc();
}

function start(actionBtn: HTMLElement) {
    try {
        players = PS.lock();

        ST = new HistoryTable('ScoreTable', players);

        players.forEach(p => Scores.push(0));
        ST.addEntry(Scores);

        AS = new ActionSelector('PlayerSelector', players, PS.getDeler());

        actionBtn.innerText = 'Calc and Add Score';
    }
    catch (e) {
        alert(e);
        PS = new PlayerSelector('PlayerSelector', 5, 4);
    }
}

function calc(){
    console.log('calc activated')
}