export default class PlayerSelector {
    readonly minP: number;
    readonly maxP: number;
    private currentP: number;

    private deler: number = 0;

    private htmlId: string;
    private HTMLDiv: HTMLElement;

    constructor(htmlId: string, maxP: number = 100, minP: number = 1) {
        this.minP = minP;
        this.currentP = minP;
        this.maxP = maxP;
        this.htmlId = htmlId;

        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
        }
        div.innerHTML = '';
        this.HTMLDiv = div;

        let addBtn = document.createElement('button');
        addBtn.id = `${htmlId}-addBtn`;
        addBtn.innerText = '+ Add';
        addBtn.addEventListener('click', e => {
            if (this.currentP == this.maxP) {
                alert('Max players reached');
                return;
            }
            this.HTMLDiv.appendChild(this.addPlayerSetter('', this.currentP));
            this.currentP++;
        });

        let vdBtn = document.createElement('button');
        vdBtn.id = `${htmlId}-vdBtn`;
        vdBtn.innerText = 'Volgende Deler';
        vdBtn.addEventListener('click', e => {
            this.nextDeler();
        });

        this.HTMLDiv.appendChild(addBtn);
        for (let i = 0; i < minP; i++) {
            let label = '';
            if (!i) label = 'Deler';
            this.HTMLDiv.appendChild(this.addPlayerSetter(label, i));
        }
        this.HTMLDiv.appendChild(vdBtn);
    }

    lock(): Array<string> {
        let arr = new Array<string>;
        for (let i = 0; i < this.currentP; i++) {
            let textInEl = document.getElementById(`${this.htmlId}-setter-text${i}`) as HTMLInputElement;
            if (!textInEl) continue;

            let text = textInEl.value;
            if (!text || text.trim() === "") throw new Error('A player has no name');
            arr.push(text);

            let textEl = document.createElement('p')
            textEl.id = `${this.htmlId}-setter-text${i}`;
            textEl.innerText = text;
            textInEl.outerHTML = textEl.outerHTML;
        }
        let addBtn = document.getElementById(`${this.htmlId}-addBtn`);
        if (addBtn) addBtn.hidden = true;
        
        let vdBtn = document.getElementById(`${this.htmlId}-vdBtn`);
        if (vdBtn) vdBtn.hidden = true;

        return arr;
    }

    nextDeler() {
        if (this.deler < this.currentP - 1) this.deler++;
        else this.deler = 0;
        for (let i = 0; i < this.currentP; i++) {
            let labelEl = document.getElementById(`${this.htmlId}-setter-label${i}`);
            if (!labelEl) continue;
            if (i == this.deler) labelEl.className = 'deler';
            else labelEl.className = '';
        }
    }

    getDeler(): number{
        return this.deler;
    }

    private addPlayerSetter(label: string, i: number): HTMLElement {
        let div = document.createElement('div');
        div.id = `${this.htmlId}-setter${i}`;
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them

        let textinEl = document.createElement('input');
        textinEl.id = `${this.htmlId}-setter-text${i}`;

        let labelEl = document.createElement('label') as HTMLLabelElement;
        labelEl.htmlFor = `${this.htmlId}-setter-text${i}`;
        labelEl.id = `${this.htmlId}-setter-label${i}`;

        labelEl.innerText = `${i + 1}.`;
        labelEl.style.marginRight = '5px';

        if (i == this.deler) labelEl.className = 'deler';
        else labelEl.className = '';

        div.appendChild(labelEl);
        div.appendChild(textinEl);
        return div;
    }
}