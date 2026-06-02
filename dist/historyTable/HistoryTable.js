export default class HistoryTable {
    constructor(htmlId, headers) {
        this.historyTable = new Array();
        this.rows = headers.length;
        this.htmlId = htmlId;
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.HTMLDiv = div;
        this.HTMLTable = document.createElement('table');
        this.HTMLTable.id = `${htmlId}-table`;
        let headerRow = document.createElement('tr');
        headerRow.id = `${htmlId}-header`;
        headers.forEach(e => headerRow.innerHTML += `<th>${e}</th>`);
        this.HTMLTable.appendChild(headerRow);
        this.HTMLDiv.appendChild(this.HTMLTable);
    }
    addEntry(entries) {
        var _a;
        if (entries.length != this.rows)
            throw new RangeError('Not enough/Too much entries in Array');
        this.historyTable.push(entries.slice());
        (_a = document.getElementById(`${this.htmlId}-header`)) === null || _a === void 0 ? void 0 : _a.after(this.makeTableRowEntry(entries));
    }
    removeLast() {
        var _a;
        if (this.historyTable.length <= 1) {
            const newLast = this.historyTable[this.historyTable.length - 1];
            return newLast ? newLast.slice() : [];
        }
        // remove last entry from data and DOM
        this.historyTable.pop();
        (_a = document.getElementById(`${this.htmlId}-row${this.historyTable.length}`)) === null || _a === void 0 ? void 0 : _a.remove();
        // return the new last entry (after removal) or empty array
        const newLast = this.historyTable[this.historyTable.length - 1];
        return newLast ? newLast.slice() : [];
    }
    getTable() {
        return this.historyTable.copyWithin(0, 0).slice();
    }
    makeTableRowEntry(entries) {
        let row = document.createElement('tr');
        row.id = `${this.htmlId}-row${this.historyTable.length - 1}`;
        entries.forEach(e => row.innerHTML += `<td>${e}</td>`);
        return row;
    }
}
