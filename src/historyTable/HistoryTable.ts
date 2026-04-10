export default class HistoryTable{
    private readonly rows: number
    private historyTable: Array<Array<Number>> = new Array<Array<number>>();
    private HTMLDiv: HTMLElement;
    private HTMLTable: HTMLTableElement;
    private htmlId: string;

    constructor(htmlId: string, headers: Array<string>){
        this.rows = headers.length;
        this.htmlId = htmlId;
        
        let div = document.getElementById(htmlId)
        if(!div){
            div = document.createElement('div');
            div.id = htmlId;
        }
        this.HTMLDiv = div;

        this.HTMLTable = document.createElement('table') as HTMLTableElement;
        this.HTMLTable.id = `${htmlId}-table`

        let headerRow = document.createElement('tr') as HTMLTableRowElement;
        headerRow.id = `${htmlId}-header`;
        headers.forEach(e => headerRow.innerHTML += `<th>${e}</th>`);
        this.HTMLTable.appendChild(headerRow);

        this.HTMLDiv.appendChild(this.HTMLTable);
    }

    addEntry(entries: Array<number>){
        if(entries.length != this.rows) throw new RangeError('Not enough/Too much entries in Array');

        this.historyTable.push(entries);
        document.getElementById(`${this.htmlId}-header`)?.after(this.makeTableRowEntry(entries));
    }

    private makeTableRowEntry(entries: Array<number>): HTMLTableRowElement{
        let row = document.createElement('tr') as HTMLTableRowElement;
        entries.forEach(e => row.innerHTML += `<td>${e}</td>`);
        return row;
    }
}