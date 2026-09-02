export default class HistoryTable<T> {
    private readonly rows: number
    private historyTable: Array<Array<T>> = new Array<Array<T>>();
    private HTMLDiv: HTMLElement;
    private HTMLTable: HTMLTableElement;
    private htmlId: string;

    constructor(htmlId: string, headers: Array<string>, entries?: Array<Array<T>>) {
        this.rows = headers.length;
        this.htmlId = htmlId;

        let div = document.getElementById(htmlId)
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.HTMLDiv = div;

        this.HTMLTable = document.createElement('table') as HTMLTableElement;
        this.HTMLTable.id = `${htmlId}-table`

        let headerRow = document.createElement('tr') as HTMLTableRowElement;
        headerRow.id = `${htmlId}-header`;
        headers.forEach(e => headerRow.innerHTML += `<th>${e}</th>`);
        this.HTMLTable.appendChild(headerRow);

        this.HTMLDiv.appendChild(this.HTMLTable);

        entries?.forEach(e => this.addEntry(e));
    }

    addEntry(entry: Array<T>) {
        if (entry.length != this.rows) throw new RangeError('Not enough/Too much entries in Array');

        this.historyTable.push(entry.slice());
        document.getElementById(`${this.htmlId}-header`)?.after(this.makeTableRowEntry(entry));
    }

    removeLast(): Array<T>{
        if(this.historyTable.length <= 1){
            const newLast = this.historyTable[this.historyTable.length - 1];
            return newLast ? newLast.slice() : [];
        }
        // remove last entry from data and DOM
        this.historyTable.pop();
        document.getElementById(`${this.htmlId}-row${this.historyTable.length}`)?.remove();
        // return the new last entry (after removal) or empty array
        const newLast = this.historyTable[this.historyTable.length - 1];
        return newLast ? newLast.slice() : [];
    }

    getTable(): Array<Array<T>>{
        return this.historyTable.copyWithin(0,0).slice();
    }

    private makeTableRowEntry(entry: Array<T>): HTMLTableRowElement {
        let row = document.createElement('tr') as HTMLTableRowElement;
        row.id = `${this.htmlId}-row${this.historyTable.length-1}`;
        entry.forEach(e => row.innerHTML += `<td>${e}</td>`);
        return row;
    }
}