export default class ModeInitializer {
    constructor(htmlId, presets) {
        this.presets = presets;
        this.htmlId = htmlId;
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.HTMLDiv = div;
        let titleEl = document.createElement('h1');
        titleEl.innerText = 'Modes:';
        this.HTMLDiv.appendChild(titleEl);
        for (let i = 0; i < presets.length; i++) {
            this.HTMLDiv.appendChild(this.addModeSetter(i, presets[i]));
        }
    }
    lock() {
        let arr = new Array;
        for (let i = 0; i < this.presets.length; i++) {
            let textInEl = document.getElementById(`${this.htmlId}-setter-text${i}`);
            if (!textInEl)
                continue;
            let text = textInEl.value;
            if (!text || text.trim() === "")
                throw new Error('A mode has no name');
            let baseInEl = document.getElementById(`${this.htmlId}-setter-base${i}`);
            if (!textInEl)
                continue;
            let base = Number(baseInEl.value);
            let overInEl = document.getElementById(`${this.htmlId}-setter-over${i}`);
            if (!overInEl)
                continue;
            let over = Number(overInEl.value);
            arr.push(this.presets[i].clone(text, base, over));
        }
        this.HTMLDiv.hidden = true;
        return arr;
    }
    addModeSetter(i, values) {
        const div = document.createElement('div');
        div.id = `${this.htmlId}-setter${i}`;
        // div.style.display = 'flex';
        // div.style.flexDirection = 'row';
        // div.style.alignItems = 'center'; // vertically center them
        const textInEl = document.createElement('input');
        textInEl.value = values ? String(values.name) : '';
        textInEl.id = `${this.htmlId}-setter-text${i}`;
        textInEl.style.marginRight = '2px';
        const rowDiv = document.createElement('div');
        rowDiv.id = `${this.htmlId}-setter${i}`;
        rowDiv.style.display = 'flex';
        rowDiv.style.flexDirection = 'row';
        rowDiv.style.alignItems = 'center'; // vertically center them
        rowDiv.style.marginTop = '2px';
        const baseInEl = document.createElement('input');
        baseInEl.type = 'number';
        baseInEl.value = values ? String(values.base) : '';
        baseInEl.id = `${this.htmlId}-setter-base${i}`;
        baseInEl.style.width = '10%';
        baseInEl.style.marginRight = '2px';
        const baseLabelEl = document.createElement('label');
        baseLabelEl.htmlFor = baseInEl.id;
        baseLabelEl.id = `${this.htmlId}-setter-baseLabel${i}`;
        baseLabelEl.innerText = `Base:`;
        baseLabelEl.style.marginRight = '5px';
        const overInEl = document.createElement('input');
        overInEl.type = 'number';
        overInEl.value = values ? String(values.over) : '';
        overInEl.id = `${this.htmlId}-setter-over${i}`;
        overInEl.style.width = '10%';
        const overLabelEl = document.createElement('label');
        overLabelEl.htmlFor = overInEl.id;
        overLabelEl.id = `${this.htmlId}-setter-overLabel${i}`;
        overLabelEl.innerText = `Over:`;
        overLabelEl.style.marginRight = '5px';
        div.appendChild(textInEl);
        rowDiv.appendChild(baseLabelEl);
        rowDiv.appendChild(baseInEl);
        rowDiv.appendChild(overLabelEl);
        rowDiv.appendChild(overInEl);
        div.appendChild(rowDiv);
        return div;
    }
}
