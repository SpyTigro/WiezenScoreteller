export default class ActionSelector {
    private deler: number;
    private players: Array<string>;

    private checkedP: Array<boolean>;
    private checkedM: number = 0;
    private slagen: number = 0;

    private htmlId: string;
    private HTMLDiv: HTMLElement;

    constructor(htmlId: string, players: Array<string>, deler: number = 0) {
        this.htmlId = htmlId;
        this.deler = deler;
        this.players = players;
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


        this.HTMLDiv.appendChild(this.makeSlagenSlider());

        this.HTMLDiv.append('Mode:');
        this.HTMLDiv.appendChild(this.makeModeSelector());
    }

    // getScores(): Array<number>{
        
    // }

    private makeModeSelector(): HTMLElement{
        let values = ['std', 'miserie', 'open miserie', 'negen', 'tien', 'elf', 'twaalf', 'all'];
        let name = 'mode'
        let div = document.createElement('div');

        for(let i = 0; i < values.length; i++){
            let l = values[i];
            if(!l) l = "";

            const DivEl = document.createElement('div');
            
            const RadioEl = document.createElement('input');
            RadioEl.type = 'radio';
            RadioEl.className = 'NodeRadio';
            RadioEl.name = `${div.id}-${name}`;
            RadioEl.id = `${div.id}-${l}`;
            RadioEl.value = l;
            if(i == this.checkedM) RadioEl.checked = true;

            RadioEl.addEventListener('change', () => {
                if(RadioEl.checked)
                    this.checkedM = i;
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