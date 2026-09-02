import { Game } from '../Game/Game.js';
import { RoundResult } from '../Game/RoundResult.js';
import { RoundType } from '../Game/RoundType.js';

export default class ActionSelector {
    private game: Game;

    private checkedP: Array<boolean>;
    private checkedM: number = 0;
    private trul: boolean = false;
    private slagen: Array<number> = [0];

    private htmlId: string;
    private HTMLDiv: HTMLElement;
    private slagenSelectorDiv: HTMLDivElement;

    constructor(htmlId: string, game: Game) {
        this.htmlId = htmlId;
        this.game = game;
        this.checkedP = new Array<boolean>(4);

        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.HTMLDiv = div;

        game.players.forEach((p, i) => {
            this.HTMLDiv.appendChild(this.makePlayerCheckDiv(p, i));
        });


        let titleEl = document.createElement('h1');
        titleEl.innerText = 'Types:';
        this.HTMLDiv.appendChild(titleEl);
        this.HTMLDiv.appendChild(this.makeTypeSelector());

        this.slagenSelectorDiv = document.createElement('div')
        this.slagenSelectorDiv.id = `${div.id}-slagenSelector`;
        this.HTMLDiv.appendChild(this.slagenSelectorDiv);

    }

    get roundResult(): RoundResult {
        if (this.slagen.reduce((total, cur) => total + cur, 0) > 13) throw new Error('teveel slagen');
        return {
            teamA: this.checkedP,
            hits: this.slagen,
            typeId: this.game.roundTypes[this.checkedM].typeId,
            trul: this.trul
        }
    }

    private makeTypeSelector(): HTMLElement {
        const radioName = 'type';
        let div = document.createElement('div');
        div.id = `${this.htmlId}-types`;
        div.className = 'Selector';

        const DivEl = document.createElement('div');
        DivEl.className = 'checkDiv';

        const checkEl = document.createElement('input');
        checkEl.type = 'checkbox';
        checkEl.id = `${div.id}-trul-check`;
        checkEl.checked = this.trul;

        const labelEl = document.createElement('label');
        if (checkEl.checked) labelEl.className = 'checked';
        else labelEl.className = 'check';
        labelEl.textContent = 'Trul';
        labelEl.htmlFor = checkEl.id;
        labelEl.style.userSelect = 'none';
        labelEl.style.pointerEvents = 'auto';

        checkEl.addEventListener('change', e => {
            this.trul = checkEl.checked;
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

        for (let i = 0; i < this.game.roundTypes.length; i++) {
            let l = this.game.roundTypes[i].typeId;
            if (!l) l = "";

            const DivEl = document.createElement('div');
            DivEl.className = 'checkDiv';

            const RadioEl = document.createElement('input');
            RadioEl.type = 'radio';
            RadioEl.name = `${div.id}-${radioName}`;
            RadioEl.id = `${div.id}-${l}`;
            RadioEl.value = l;
            RadioEl.checked = i == this.checkedM;

            const radiolabelEl = document.createElement('label');
            if (RadioEl.checked) radiolabelEl.className = 'checked';
            else radiolabelEl.className = 'check';
            radiolabelEl.textContent = l;
            radiolabelEl.htmlFor = RadioEl.id;

            RadioEl.addEventListener('input', () => {
                const allLabels = div.querySelectorAll('label');
                allLabels.forEach(l => {
                    l.className = 'check';
                    if ((document.getElementById(l.htmlFor) as HTMLInputElement)?.checked) {
                        l.className = 'checked';
                    }
                    if (RadioEl.checked) {
                        this.checkedM = i;
                        this.renderSlagenSelector();
                    }
                })
            });

            DivEl.appendChild(RadioEl);
            DivEl.appendChild(radiolabelEl);
            div.appendChild(DivEl);
        };

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
        if (i == this.game.deler) ilabelEl.className = 'deler';

        let labelEl = document.createElement('label');
        labelEl.htmlFor = checkEl.id;
        labelEl.innerText = name;
        if (checkEl.checked) labelEl.className = 'checked';
        else labelEl.className = 'check';

        if ((this.game.players.length == 5 && i != this.game.deler))
            checkEl.addEventListener('change', e => {
                if (i > this.game.deler)
                    this.checkedP[i - 1] = checkEl.checked;
                else
                    this.checkedP[i] = checkEl.checked;

                if (checkEl.checked) labelEl.className = 'checked';
                else labelEl.className = 'check';
                this.renderSlagenSelector();
            });
        else if(this.game.players.length == 4)
            checkEl.addEventListener('change', e => {
                this.checkedP[i] = checkEl.checked;
                if (checkEl.checked) labelEl.className = 'checked';
                else labelEl.className = 'check';
                this.renderSlagenSelector();
            });

        div.appendChild(ilabelEl);
        div.appendChild(checkEl);
        div.appendChild(labelEl);
        return div
    }

    private renderSlagenSelector() {
        let type = this.game.roundTypes[this.checkedM];

        this.slagenSelectorDiv.innerHTML = '';
        if (type.teamed) {
            this.setSlagenLength(1);
            this.slagenSelectorDiv.appendChild(this.makeSlagenSlider(0, 'Slagen: '));
        }
        else {
            let selectedPlayers = []
            if (this.game.players.length == 5) 
                selectedPlayers = this.game.players.filter((_, i) => i == this.game.deler ? false : i < this.game.deler ? this.checkedP[i] : this.checkedP[i - 1]);
            else 
                selectedPlayers = this.game.players.filter((_, i) => this.checkedP[i]);
            this.setSlagenLength(selectedPlayers.length)
            selectedPlayers.forEach((p, i) => {
                this.slagenSelectorDiv.appendChild(this.makeSlagenSlider(i, `Slagen voor ${p}: `));
            })
        }
    }

    private setSlagenLength(length: number): void {
        if (this.slagen.length > length) {
            this.slagen = this.slagen.slice(0, length);
        } else if (this.slagen.length < length) {
            this.slagen = [...this.slagen, ...new Array(length - this.slagen.length).fill(0)];
        }
    }

    private makeSlagenSlider(i: number, label: string): HTMLElement {
        const div = document.createElement('div');

        let numInEl = document.createElement('input');
        numInEl.type = 'number';
        numInEl.id = `${div.id}-slagen-num${i}`;
        numInEl.min = '0';
        numInEl.max = '13';
        numInEl.value = String(this.slagen[i]);

        let sliderEl = document.createElement('input');
        sliderEl.type = 'range';
        sliderEl.id = `${div.id}-slagen-slider${i}`;
        sliderEl.min = '0';
        sliderEl.max = '13';
        sliderEl.value = String(this.slagen[i]);

        numInEl.addEventListener('input', e => {
            this.slagen[i] = Number(numInEl.value);
            if (this.slagen[i] > 13) this.slagen[i] = 13;
            else if (this.slagen[i] < 0) this.slagen[i] = 0;
            numInEl.value = String(this.slagen[i]);
            sliderEl.value = String(this.slagen[i]);
        });
        sliderEl.addEventListener('input', e => {
            this.slagen[i] = Number(sliderEl.value);
            numInEl.value = String(this.slagen[i]);
        });

        let labelEl = document.createElement('label');
        labelEl.htmlFor = numInEl.id;
        labelEl.innerText = label;
        labelEl.style.marginRight = '5px';

        div.appendChild(labelEl);
        div.appendChild(numInEl);
        div.appendChild(document.createElement('br'));
        div.appendChild(sliderEl);
        return div;
    }
}