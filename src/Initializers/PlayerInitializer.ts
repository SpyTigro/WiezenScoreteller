export default class PlayerInitializer {
    readonly minP: number;
    readonly maxP: number;

    private currentP: number = 0;
    private deler: number = 0;

    private htmlId: string;
    private HTMLDiv: HTMLElement;

    constructor(htmlId: string, maxP: number = 100, minP: number = 1) {
        this.minP = minP;
        this.maxP = maxP;
        this.htmlId = htmlId;

        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
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
            this.addPlayerSetter('');
            // document.getElementById(`${this.htmlId}-setter${this.currentP - 1}`)?.after(this.addPlayerSetter('', this.currentP));
            // this.currentP++;
        });

        this.HTMLDiv.appendChild(addBtn);
        for (let i = 0; i < minP; i++) {
            this.addPlayerSetter('');
        }

        let vdBtn = document.createElement('button');
        vdBtn.id = `${htmlId}-vdBtn`;
        vdBtn.innerText = 'Volgende Deler';
        vdBtn.addEventListener('click', e => {
            this.nextDeler();
        });
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
        }
        this.HTMLDiv.hidden = true

        return arr;
    }

    getDeler(): number {
        return this.deler;
    }

    setPlayers(players: Array<string>) {
        for (let i = 0; i < Math.max(this.currentP, players.length); i++) {
            let textInEl = document.getElementById(`${this.htmlId}-setter-text${i}`) as HTMLInputElement;

            if (!textInEl) this.addPlayerSetter(players[i]);
            else if (players[i]) textInEl.value = players[i]
        }
    }

    setDeler(deler: number) {
        while (this.deler != deler) {
            this.nextDeler()
        }
    }

    private nextDeler() {
        if (this.deler < this.currentP - 1) this.deler++;
        else this.deler = 0;
        for (let i = 0; i < this.currentP; i++) {
            let labelEl = document.getElementById(`${this.htmlId}-setter-label${i}`);
            if (!labelEl) continue;
            if (i == this.deler) labelEl.className = 'deler';
            else labelEl.className = '';
        }
    }

    private addPlayerSetter(name: string) {
        let i = this.currentP;

        let div = document.createElement('div');
        div.id = `${this.htmlId}-setter${i}`;
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them

        let textinEl = document.createElement('input');
        textinEl.id = `${this.htmlId}-setter-text${i}`;
        textinEl.value = name;

        let labelEl = document.createElement('label') as HTMLLabelElement;
        labelEl.htmlFor = `${this.htmlId}-setter-text${i}`;
        labelEl.id = `${this.htmlId}-setter-label${i}`;

        labelEl.innerText = `${i + 1}.`;
        labelEl.style.marginRight = '5px';

        if (i == this.deler) labelEl.className = 'deler';
        else labelEl.className = '';

        div.appendChild(labelEl);
        div.appendChild(textinEl);

        let prevdiv = document.getElementById(`${this.htmlId}-setter${i-1}`);
        if(prevdiv) prevdiv.after(div);
        else this.HTMLDiv.appendChild(div);

        this.currentP++;
    }
}