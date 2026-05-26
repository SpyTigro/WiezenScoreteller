import ActionMode from "./ActionMode.js";

export default class ActionSelector {
    private deler: number;
    private players: Array<string>;
    private modes: Array<ActionMode>;

    private checkedP: Array<boolean>;
    private checkedM: number = -1;
    private trul: boolean = false;
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


        let titleEl = document.createElement('h1');
        titleEl.innerText = 'Modes:';
        this.HTMLDiv.appendChild(titleEl);
        this.HTMLDiv.appendChild(this.makeModeSelector());

    }

    getScoreDelta(): Array<number> {
        if(this.checkedM<0)
            throw new Error('No mode selected');

        let deltaScores = this.modes[this.checkedM].getScoreDelta(this.checkedP, this.deler, this.trul);
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

    getDeler(): number {
        return this.deler;
    }

    private makeModeSelector(): HTMLElement {
        const radioName = 'mode';
        let div = document.createElement('div');
        div.id = `${this.htmlId}-modes`;
        div.className = 'Selector';

        const DivEl = document.createElement('div');
        DivEl.className = 'checkDiv';

        const checkEl = document.createElement('input');
        checkEl.type = 'checkbox';
        checkEl.id = `${div.id}-trul-check`;
        checkEl.value = 'trul';
        checkEl.addEventListener('change', e => {
            this.trul = checkEl.checked;
        });

        const labelEl = document.createElement('label');
        if (checkEl.checked) labelEl.className = 'checked';
        else labelEl.className = 'check';
        labelEl.textContent = 'Trul';
        labelEl.htmlFor = checkEl.id;
        labelEl.style.userSelect = 'none';
        labelEl.style.pointerEvents = 'auto';

        checkEl.addEventListener('change', e => {
            if (checkEl.checked) {
                labelEl.className = 'checked';
            }
            else {
                labelEl.className = 'check';
            }
        })

        DivEl.appendChild(checkEl);
        DivEl.appendChild(labelEl);
        div.appendChild(DivEl);

        const HrEl = document.createElement('hr');
        HrEl.className = "checkRadioDivider";
        div.appendChild(HrEl);

        let slagenSelectorDiv = document.createElement('div')
        slagenSelectorDiv.id = `${div.id}-slagenSelector`;

        for (let i = 0; i < this.modes.length; i++) {
            let l = this.modes[i].name;
            if (!l) l = "";

            const DivEl = document.createElement('div');
            DivEl.className = 'checkDiv';

            const RadioEl = document.createElement('input');
            RadioEl.type = 'radio';
            RadioEl.name = `${div.id}-${radioName}`;
            RadioEl.id = `${div.id}-${l}`;
            RadioEl.value = l;

            const radiolabelEl = document.createElement('label');
            if (RadioEl.checked) radiolabelEl.className = 'checked';
            else radiolabelEl.className = 'check';
            radiolabelEl.textContent = l;
            radiolabelEl.htmlFor = RadioEl.id;

            RadioEl.addEventListener('change', () => {
                const allLabels = div.querySelectorAll('label');
                allLabels.forEach(l => {
                    l.className = 'check';
                    if ((document.getElementById(l.htmlFor) as HTMLInputElement)?.checked) {
                        l.className = 'checked';
                    }
                    if (RadioEl.checked) {
                        this.checkedM = i;
                        this.modes[this.checkedM].renderSlagenSelector(slagenSelectorDiv.id, this.players);
                    }
                })
            });

            DivEl.appendChild(RadioEl);
            DivEl.appendChild(radiolabelEl);
            div.appendChild(DivEl);
        };

        div.appendChild(slagenSelectorDiv);

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

        let ilabelEl = document.createElement('label') as HTMLLabelElement;
        ilabelEl.htmlFor = checkEl.id;
        ilabelEl.id = `${this.htmlId}-check-ilabel${i}`;
        ilabelEl.style.marginRight = '5px';
        ilabelEl.innerText = `${i + 1}.`;
        if (i == this.deler) ilabelEl.className = 'deler';

        let labelEl = document.createElement('label');
        labelEl.htmlFor = checkEl.id;
        labelEl.innerText = name;
        if (checkEl.checked) labelEl.className = 'checked';
        else labelEl.className = 'check';

        checkEl.addEventListener('change', e => {
            this.checkedP[i] = checkEl.checked;
            if (checkEl.checked) labelEl.className = 'checked';
            else labelEl.className = 'check';
        });

        div.appendChild(ilabelEl);
        div.appendChild(checkEl);
        div.appendChild(labelEl);
        return div
    }
}