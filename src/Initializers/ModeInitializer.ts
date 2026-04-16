import ActionMode from "../actionSelector/ActionMode.js";

export default class ModeInitializer {
    private presets: Array<ActionMode>;

    private htmlId: string;
    private HTMLDiv: HTMLElement;

    constructor(htmlId: string, presets: Array<ActionMode>) {
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

    lock(): Array<ActionMode> {
        let arr = new Array<ActionMode>;
        for (let i = 0; i < this.presets.length; i++) {
            let textInEl = document.getElementById(`${this.htmlId}-setter-text${i}`) as HTMLInputElement;
            if (!textInEl) continue;
            let text = textInEl.value;
            if (!text || text.trim() === "") throw new Error('A mode has no name');

            let baseInEl = document.getElementById(`${this.htmlId}-setter-base${i}`) as HTMLInputElement;
            if (!textInEl) continue;
            let base = Number(baseInEl.value);

            let overInEl = document.getElementById(`${this.htmlId}-setter-over${i}`) as HTMLInputElement;
            if (!overInEl) continue;
            let over = Number(overInEl.value);

            arr.push(this.presets[i].clone(text, base, over));
        }
        this.HTMLDiv.hidden = true;

        return arr;
    }

    private addModeSetter(i: number, values?: ActionMode): HTMLElement {
        let div = document.createElement('div');
        div.id = `${this.htmlId}-setter${i}`;
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them

        let textInEl = document.createElement('input');
        textInEl.value = values? values.name : '';
        textInEl.id = `${this.htmlId}-setter-text${i}`;
        textInEl.style.marginRight = '2px';

        let baseInEl = document.createElement('input');
        baseInEl.type = 'number';
        baseInEl.value = values? String(values.base) : '';
        baseInEl.id = `${this.htmlId}-setter-base${i}`;
        baseInEl.style.width = '10%';
        baseInEl.style.marginRight = '2px';
        
        let overInEl = document.createElement('input');
        overInEl.type = 'number';
        overInEl.value = values? String(values.over) : '';
        overInEl.id = `${this.htmlId}-setter-over${i}`;
        overInEl.style.width = '10%';

        div.appendChild(textInEl);
        div.appendChild(baseInEl);
        div.appendChild(overInEl);
        return div;
    }
}