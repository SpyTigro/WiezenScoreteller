import { RoundType, RoundTypeOptions } from "../Game/RoundType";

export class RoundTypeInitializer {
    private htmlId: string;

    private roundTypes: RoundType[];

    constructor(htmlId: string, roundTypes: RoundType[]){
        this.htmlId = htmlId;

        this.roundTypes = roundTypes;
    }

    addRoundTypeSetter(i: number, roundType?: RoundType){
        const div = document.createElement('div');
        div.id = `${this.htmlId}-setter${i}`;
        // div.style.display = 'flex';
        // div.style.flexDirection = 'row';
        // div.style.alignItems = 'center'; // vertically center them

        const textInEl = document.createElement('input');
        textInEl.value = roundType ? roundType.typeId : '';
        textInEl.id = `${this.htmlId}-setter-text${i}`;
        textInEl.style.marginRight = '2px';

        const OptionBtnEl = document.createElement('button');
        OptionBtnEl.innerText = 'Options >';

        const rowDiv = document.createElement('div');
        rowDiv.id = `${this.htmlId}-setter${i}`;
        rowDiv.style.display = 'flex';
        rowDiv.style.flexDirection = 'row';
        rowDiv.style.alignItems = 'center'; // vertically center them
        rowDiv.style.marginTop = '2px';

        OptionBtnEl.addEventListener('click', () =>{
            rowDiv.hidden = !rowDiv.hidden;
        })

        const baseInEl = document.createElement('input');
        baseInEl.type = 'number';
        baseInEl.value = roundType ? String(roundType.base) : '';
        baseInEl.id = `${this.htmlId}-setter-base${i}`;
        baseInEl.style.width = '10%';
        baseInEl.style.marginRight = '2px';

        const baseLabelEl = document.createElement('label') as HTMLLabelElement;
        baseLabelEl.htmlFor = baseInEl.id;
        baseLabelEl.id = `${this.htmlId}-setter-baseLabel${i}`;
        baseLabelEl.innerText = `Base:`;
        baseLabelEl.style.marginRight = '5px';
        
        const overInEl = document.createElement('input');
        overInEl.type = 'number';
        overInEl.value = roundType ? String(roundType.over) : '';
        overInEl.id = `${this.htmlId}-setter-over${i}`;
        overInEl.style.width = '10%';

        const overLabelEl = document.createElement('label') as HTMLLabelElement;
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