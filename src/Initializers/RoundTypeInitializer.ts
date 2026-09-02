import { RoundType, roundTypeOptionKeys, RoundTypeOptions } from "../Game/RoundType.js";

export class RoundTypeInitializer {
    private htmlId: string;
    private HTMLDiv: HTMLDivElement;

    private roundTypes: RoundType[];
    private amountSetters: number;

    constructor(htmlId: string, roundTypes: RoundType[]) {
        this.htmlId = htmlId;

        let div = document.getElementById(htmlId) as HTMLDivElement;
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';

        this.HTMLDiv = div;

        this.roundTypes = roundTypes;
        this.amountSetters = 0;

        let titleEl = document.createElement('h1');
        titleEl.innerText = 'Types:';
        div.appendChild(titleEl);

        const addTypeBtn = document.createElement('button');
        addTypeBtn.id = `${this.htmlId}-addTypeBtn`;
        addTypeBtn.innerText = '+ Add'

        addTypeBtn.addEventListener('click', () => {
            div.appendChild(this.addRoundTypeSetter(this.amountSetters));
            this.amountSetters += 1;
        })
        div.appendChild(addTypeBtn);

        this.roundTypes.forEach((r, i) => {
            div.appendChild(this.addRoundTypeSetter(i, r));
            this.amountSetters += 1;
        });
    }

    lock(): Array<RoundType> {
        const res = new Array<RoundType>
        for (let i = 0; i < this.amountSetters; i++) {
            let optionals: RoundTypeOptions = {};
            roundTypeOptionKeys.forEach((a) => {
                const attributeInput = document.getElementById(`${this.htmlId}-In${a}${i}`) as HTMLInputElement;
                if (attributeInput)
                    switch (a) {
                        case roundTypeOptionKeys[0]:
                            optionals.over = Number(attributeInput.value);
                            break;
                        case roundTypeOptionKeys[1]:
                            optionals.loseMod = Number(attributeInput.value);
                            break;
                        case roundTypeOptionKeys[2]:
                            optionals.kaputMod = Number(attributeInput.value);
                            break;
                        case roundTypeOptionKeys[3]:
                            optionals.thresholdSolo = Number(attributeInput.value);
                            break;
                        case roundTypeOptionKeys[4]:
                            optionals.reverseThreshold = attributeInput.checked;
                            break;
                        case roundTypeOptionKeys[5]:
                            optionals.teamed = attributeInput.checked;
                            break;
                        case roundTypeOptionKeys[6]:
                            optionals.overTrul = attributeInput.checked;
                            break;
                        case roundTypeOptionKeys[7]:
                            optionals.minP = Number(attributeInput.value);
                            break;
                        case roundTypeOptionKeys[8]:
                            optionals.maxP = Number(attributeInput.value);
                            break;
                        default:
                            return;
                    }
            });
            let typeId = ''
            const typeInput = document.getElementById(`${this.htmlId}-InTypeId${i}`) as HTMLInputElement;
            if (!typeInput) throw new Error('No base Entered');
            typeId = typeInput.value

            let base = 0;
            const baseInput = document.getElementById(`${this.htmlId}-InBase${i}`) as HTMLInputElement;
            if (!baseInput) throw new Error('No base Entered');
            base = Number(baseInput.value)

            let threshold = 0;
            const thresholdInput = document.getElementById(`${this.htmlId}-InThreshold${i}`) as HTMLInputElement;
            if (!thresholdInput) throw new Error('No base Entered');
            threshold = Number(thresholdInput.value)

            res.push(new RoundType(typeId, base, threshold, optionals))
        }
        this.HTMLDiv.hidden = true;

        return res;
    }

    addRoundTypeSetter(id: number, roundType?: RoundType): HTMLDivElement {
        const div = this.columnDiv(`${this.htmlId}-setter${id}`);

        const topDiv = this.rowDiv(`${this.htmlId}-divTop${id}`);

        const textInEl = document.createElement('input');
        textInEl.value = roundType ? roundType.typeId : '';
        textInEl.id = `${this.htmlId}-InTypeId${id}`;
        textInEl.style.marginRight = '2px';

        const OptionBtnEl = document.createElement('button');
        OptionBtnEl.innerText = 'Options [Show]';

        topDiv.appendChild(textInEl);
        topDiv.appendChild(OptionBtnEl);

        //Add Option div + show/hide
        const OptionDiv = document.createElement('div');
        OptionDiv.hidden = true;
        OptionDiv.id = `${this.htmlId}-typeoptions${id}`;

        OptionBtnEl.addEventListener('click', () => {
            if (OptionDiv.hidden) {
                OptionDiv.hidden = false;
                OptionBtnEl.innerText = 'Options [Hide]';
            }
            else {
                OptionDiv.hidden = true;
                OptionBtnEl.innerText = 'Options [Show]';
            }
        })

        //decorate OptionDiv
        const attributeSelectDiv = this.rowDiv(`${this.htmlId}-divSelectAtt${id}`);

        const attributeSelect = document.createElement('select');
        roundTypeOptionKeys.forEach((a, i) => {
            const selectOption = document.createElement('option')
            selectOption.innerText = a;
            selectOption.id = `${this.htmlId}-attributeSelectOption${id}${i}`;
            attributeSelect.appendChild(selectOption);
        });
        attributeSelect.selectedIndex = -1;

        const addAttributeBtn = document.createElement('button');
        addAttributeBtn.innerText = '+';
        addAttributeBtn.id = `${this.htmlId}-addAttributeBtn${id}`;

        addAttributeBtn.addEventListener('click', () => {
            let i = attributeSelect.selectedIndex;
            const option = document.getElementById(`${this.htmlId}-attributeSelectOption${id}${i}`);
            if (option) {
                option.hidden = true;

                const remainingVisibleOptionIndex = Array.from(attributeSelect.options)
                    .findIndex((selectOption, optionIndex) => optionIndex !== i && !selectOption.hidden);

                attributeSelect.selectedIndex = remainingVisibleOptionIndex >= 0
                    ? remainingVisibleOptionIndex
                    : -1;
            }
            else return;

            this.addAttributeSetter(id, option, OptionDiv, roundType);
        })

        attributeSelectDiv.appendChild(attributeSelect);
        attributeSelectDiv.appendChild(addAttributeBtn);

        div.appendChild(topDiv);
        OptionDiv.appendChild(attributeSelectDiv);
        OptionDiv.appendChild(this.numInWithLabel(id, 'Base', roundType?.base));
        OptionDiv.appendChild(this.numInWithLabel(id, 'Threshold', roundType?.threshold));

        if (roundType) {
            Array.from(attributeSelect.options).forEach((o, i) => {
                const option = o;
                if (option) {
                    option.hidden = true;

                    const remainingVisibleOptionIndex = Array.from(attributeSelect.options)
                        .findIndex((selectOption, optionIndex) => optionIndex !== i && !selectOption.hidden);

                    attributeSelect.selectedIndex = remainingVisibleOptionIndex >= 0
                        ? remainingVisibleOptionIndex
                        : -1;
                }
                else return;

                this.addAttributeSetter(id, option, OptionDiv, roundType);
            })
        }

        div.appendChild(OptionDiv);
        return div;
    }

    private addAttributeSetter(id: number, option: HTMLElement, OptionDiv: HTMLDivElement, roundType?: RoundType) {
        const attributeDiv = this.rowDiv(`${this.htmlId}-attribute${option.innerText}${id}`);

        const removeBtn = document.createElement('button');
        removeBtn.innerText = '-';
        removeBtn.id = `${this.htmlId}-divAttribute${option.innerText}RBtn${id}`;

        removeBtn.addEventListener('click', () => {
            OptionDiv.removeChild(attributeDiv);
            option.hidden = false;
        })

        const attributeSetterDiv = this.attributeSetterDiv(id, option.innerText, roundType);
        if (attributeSetterDiv) {
            attributeDiv.appendChild(removeBtn);
            attributeDiv.appendChild(attributeSetterDiv);
        }
        else return

        OptionDiv.appendChild(attributeDiv);
    }

    private rowDiv(id: string): HTMLDivElement {
        const div = document.createElement('div');
        div.id = id;
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignContent = 'center'; // vertically center them
        return div
    }

    private columnDiv(id: string): HTMLDivElement {
        const div = document.createElement('div');
        div.id = id;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignContent = 'center'; // vertically center them
        return div
    }

    private attributeSetterDiv(id: number, attribute: string, values?: RoundType): HTMLDivElement | undefined {
        let value: number | boolean;
        switch (attribute) {
            case roundTypeOptionKeys[0]:
                value = values ? values.over : 0;
                break;
            case roundTypeOptionKeys[1]:
                value = values ? values.loseMod : 1;
                break;
            case roundTypeOptionKeys[2]:
                value = values ? values.kaputMod : 1;
                break;
            case roundTypeOptionKeys[3]:
                value = values ? values.thresholdSolo ? values.thresholdSolo : values?.threshold : 0;
                break;
            case roundTypeOptionKeys[4]:
                value = values ? values.reverse : false;
                break;
            case roundTypeOptionKeys[5]:
                value = values ? values.teamed : true;
                break;
            case roundTypeOptionKeys[6]:
                value = values ? values.overTrul : false;
                break;
            case roundTypeOptionKeys[7]:
                value = values ? values.minP : 1;
                break;
            case roundTypeOptionKeys[8]:
                value = values ? values.maxP : 4;
                break;
            default:
                return;
        }
        if (typeof value === 'number')
            return this.numInWithLabel(id, attribute, value);
        else
            return this.checkWithLabel(id, attribute, value)
    }

    private numInWithLabel(id: number, name: string, value: number = 0): HTMLDivElement {
        const div = document.createElement('div');
        div.id = `${this.htmlId}-divNumIn${name}${id}`;

        const InEl = document.createElement('input');
        InEl.type = 'number';
        InEl.value = String(value);
        InEl.id = `${this.htmlId}-In${name}${id}`;
        InEl.style.width = '10%';

        const LabelEl = document.createElement('label') as HTMLLabelElement;
        LabelEl.htmlFor = InEl.id;
        LabelEl.id = `${this.htmlId}-labelNumIn${name}${id}`;
        LabelEl.innerText = `${name}: `;
        LabelEl.style.marginRight = '5px';

        div.appendChild(LabelEl);
        div.appendChild(InEl);
        return div;
    }

    private checkWithLabel(id: number, name: string, value: boolean = false): HTMLDivElement {
        const div = document.createElement('div');
        div.id = `${this.htmlId}-divCheck${name}${id}`;
        div.className = 'checkDiv';

        const InEl = document.createElement('input');
        InEl.type = 'checkbox';
        InEl.checked = value;
        InEl.id = `${this.htmlId}-In${name}${id}`;
        InEl.style.width = '10%';

        const LabelEl = document.createElement('label') as HTMLLabelElement;
        if (InEl.checked) LabelEl.className = 'checked';
        else LabelEl.className = 'check'
        LabelEl.htmlFor = InEl.id;
        LabelEl.id = `${this.htmlId}-labelCheck${name}${id}`;
        LabelEl.innerText = `${name}`;
        LabelEl.style.marginRight = '5px';

        InEl.addEventListener('change', () => {
            if (InEl.checked) LabelEl.className = 'checked';
            else LabelEl.className = 'check';
        })

        div.appendChild(LabelEl);
        div.appendChild(InEl);
        return div;
    }
}
