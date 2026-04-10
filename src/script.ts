import HistoryTable from "./historyTable/HistoryTable.js";
import PlayerSelector from "./playerSelector/PlayerSelector.js";

window.onload = function (){
    let PS = new PlayerSelector('PlayerSelector', 5, 4);
    let ST;
    let Scores = new Array<number>;


    let startBtn = document.getElementById('start');
    if(startBtn) startBtn.addEventListener('click', e =>{
        try{
            let players = PS.lock();

            ST = new HistoryTable('ScoreTable', players);

            players.forEach(p => Scores.push(0));
            ST.addEntry(Scores);

            startBtn.hidden = true;
        }
        catch(e){
            alert(e);
            PS = new PlayerSelector('PlayerSelector', 5, 4);
        }
    });
}