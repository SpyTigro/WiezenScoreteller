import ActionMode from "./ActionMode.js";

export default class ActionSelector {
    private deler: number;
    private players: Array<string>;
    private modes: Array<ActionMode>;

    private checkedP: Array<boolean>;
    private checkedM: number = 0;
    private slagen: number = 0;

    private htmlId: string;
    private HTMLDiv: HTMLElement;

    constructor(htmlId: string, players: Array<string>, modes: Array<ActionMode> = [], deler: number = 0) {
        this.htmlId = htmlId;
        this.deler = deler;
        if (players.length < 4 || players.length > 5) throw new Error('Incorrect amount of players');
        this.players = players;
        this.modes = modes;
        this.checkedP = new Array<boolean>(players.length);

        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.HTMLDiv = div;

        players.forEach(p => {
            this.HTMLDiv.appendChild(this.makePlayerCheckDiv(p, players.indexOf(p)));
        });

        this.HTMLDiv.append('Mode:');
        this.HTMLDiv.appendChild(this.makeModeSelector());

        let slagenSelectorDiv = document.createElement('div')
        slagenSelectorDiv.id = `${htmlId}-slagenSelector`;
        this.HTMLDiv.appendChild(slagenSelectorDiv);
        this.modes[this.checkedM].renderSlagenSelector(slagenSelectorDiv.id);
    }

    getScoreDelta(): Array<number> {
        let deltaScores = this.modes[this.checkedM].getScoreDelta(this.checkedP, this.deler);
        this.nextDeler();
        return deltaScores;
    }

    nextDeler() {
        if (this.deler < this.players.length - 1) this.deler++;
        else this.deler = 0;
        for (let i = 0; i < this.players.length; i++) {
            let labelEl = document.getElementById(`${this.htmlId}-check-ilabel${i}`);
            if (!labelEl) continue;
            if (i == this.deler) labelEl.className = 'deler';
            else labelEl.className = '';
        }
    }

    getDeler(): number{
        return this.deler;
    }

    private makeModeSelector(): HTMLElement {
        let radioName = 'mode'
        let div = document.createElement('div');

        for (let i = 0; i < this.modes.length; i++) {
            let l = this.modes[i].name;
            if (!l) l = "";

            const DivEl = document.createElement('div');

            const RadioEl = document.createElement('input');
            RadioEl.type = 'radio';
            RadioEl.className = 'NodeRadio';
            RadioEl.name = `${div.id}-${radioName}`;
            RadioEl.id = `${div.id}-${l}`;
            RadioEl.value = l;
            if (i == this.checkedM)
                RadioEl.checked = true;

            RadioEl.addEventListener('change', () => {
                if (RadioEl.checked) {
                    this.checkedM = i;
                    this.modes[i].renderSlagenSelector(`${this.htmlId}-slagenSelector`);
                }
            });

            const labelEl = document.createElement('label');
            labelEl.className = 'NodeRadio-label';
            labelEl.textContent = l;
            labelEl.setAttribute('for', `${div.id}-${l}`);
            labelEl.style.userSelect = 'none';
            labelEl.style.pointerEvents = 'auto';

            DivEl.appendChild(RadioEl);
            DivEl.appendChild(labelEl);
            div.appendChild(DivEl);
        };
        return div;
    }

    private makeSlagenSlider(): HTMLElement {
        let div = document.createElement('div');

        let numInEl = document.createElement('input');
        numInEl.type = 'number';
        numInEl.id = `${this.htmlId}-slagen-num`;
        numInEl.min = '0';
        numInEl.max = '13';
        numInEl.value = String(this.slagen);

        let sliderEl = document.createElement('input');
        sliderEl.type = 'range';
        sliderEl.id = `${this.htmlId}-slagen-slider`;
        sliderEl.min = '0';
        sliderEl.max = '13';
        sliderEl.value = String(this.slagen);

        numInEl.addEventListener('input', e => {
            this.slagen = Number(numInEl.value);
            sliderEl.value = String(this.slagen);
        });
        sliderEl.addEventListener('input', e => {
            this.slagen = Number(sliderEl.value);
            numInEl.value = String(this.slagen);
        });

        let labelEl = document.createElement('label');
        labelEl.htmlFor = numInEl.id;
        labelEl.innerText = 'Slagen gehaald:';
        labelEl.style.marginRight = '5px';

        div.appendChild(labelEl);
        div.appendChild(numInEl);
        div.appendChild(document.createElement('br'));
        div.appendChild(sliderEl);
        return div;
    }

    private makePlayerCheckDiv(name: string, i: number): HTMLElement {
        let div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them

        let checkEl = document.createElement('input');
        checkEl.type = 'checkbox';
        checkEl.id = `${this.htmlId}-check-${name}`;
        checkEl.value = name;
        checkEl.addEventListener('change', e => {
            this.checkedP[i] = checkEl.checked;
        });

        let ilabelEl = document.createElement('label') as HTMLLabelElement;
        ilabelEl.htmlFor = checkEl.id;
        ilabelEl.id = `${this.htmlId}-check-ilabel${i}`;
        ilabelEl.style.marginRight = '5px';
        ilabelEl.innerText = `${i + 1}.`;
        if (i == this.deler) ilabelEl.className = 'deler';

        let labelEl = document.createElement('label');
        labelEl.htmlFor = checkEl.id;
        labelEl.innerText = name;



        div.appendChild(ilabelEl);
        div.appendChild(checkEl);
        div.appendChild(labelEl);
        return div
    }
}