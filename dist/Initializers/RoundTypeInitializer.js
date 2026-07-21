import { RoundType, roundTypeOptionKeys } from "../Game/RoundType.js";
export class RoundTypeInitializer {
    constructor(htmlId, roundTypes) {
        this.htmlId = htmlId;
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        this.roundTypes = roundTypes;
        this.amountSetters = 0;
        let titleEl = document.createElement('h1');
        titleEl.innerText = 'Types:';
        div.appendChild(titleEl);
        const addTypeBtn = document.createElement('button');
        addTypeBtn.id = `${this.htmlId}-addTypeBtn`;
        addTypeBtn.addEventListener('click', () => {
            div.appendChild(this.addRoundTypeSetter(this.amountSetters));
            this.amountSetters += 1;
        });
        div.appendChild(addTypeBtn);
        this.roundTypes.forEach((r, i) => {
            div.appendChild(this.addRoundTypeSetter(i, r));
            this.amountSetters += 1;
        });
    }
    get types() {
        const res = new Array;
        for (let i = 0; i < this.amountSetters; i++) {
            let optionals = {};
            roundTypeOptionKeys.forEach((a, i) => {
                const attributeInput = document.getElementById(`${this.htmlId}-In${a}${i}`);
                if (attributeInput)
                    switch (a) {
                        case 'Over':
                            optionals.over = Number(attributeInput.value);
                            break;
                        case 'Lose Mult':
                            optionals.loseMod = Number(attributeInput.value);
                            break;
                        case 'Kaput Mult':
                            optionals.kaputMod = Number(attributeInput.value);
                            break;
                        case 'Threshold Solo':
                            optionals.thresholdSolo = Number(attributeInput.value);
                            break;
                        case 'Reverse Threshold':
                            optionals.reverseThreshold = Boolean(attributeInput.value);
                            break;
                        case 'In Teams':
                            optionals.teamed = Boolean(attributeInput.value);
                            break;
                        case 'Works in Trul':
                            optionals.overTrul = Boolean(attributeInput.value);
                            break;
                        default:
                            return;
                    }
            });
            let typeId = '';
            const typeInput = document.getElementById(`${this.htmlId}-InTypeId${i}`);
            if (!typeInput)
                throw new Error('No base Entered');
            typeId = typeInput.value;
            let base = 0;
            const baseInput = document.getElementById(`${this.htmlId}-InBase${i}`);
            if (!baseInput)
                throw new Error('No base Entered');
            base = Number(baseInput.value);
            let threshold = 0;
            const thresholdInput = document.getElementById(`${this.htmlId}-InThreshold${i}`);
            if (!thresholdInput)
                throw new Error('No base Entered');
            threshold = Number(thresholdInput.value);
            res.push(new RoundType(typeId, base, threshold, optionals));
        }
        return res;
    }
    addRoundTypeSetter(id, roundType) {
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
        });
        const attributeSelectDiv = this.rowDiv(`${this.htmlId}-divSelectAtt${id}`);
        const attributeSelect = document.createElement('select');
        roundTypeOptionKeys.forEach((a, i) => {
            const selectOption = document.createElement('option');
            selectOption.innerText = a;
            selectOption.id = `${this.htmlId}-attributeSelectOption${id}${i}`;
            attributeSelect.appendChild(selectOption);
        });
        const addAttributeBtn = document.createElement('button');
        addAttributeBtn.innerText = '+';
        addAttributeBtn.id = `${this.htmlId}-addAttributeBtn${id}`;
        addAttributeBtn.addEventListener('click', () => {
            let i = attributeSelect.selectedIndex;
            const option = document.getElementById(`${this.htmlId}-attributeSelectOption${id}${i}`);
            if (option)
                option.hidden = true;
            else
                return;
            const attributeDiv = this.rowDiv(`${this.htmlId}-attribute${i}${id}`);
            const removeBtn = document.createElement('button');
            removeBtn.innerText = '-';
            removeBtn.id = `${this.htmlId}-divOptionRBtn${id}`;
            removeBtn.addEventListener('click', () => {
                document.removeChild(attributeDiv);
                option.hidden = false;
            });
            const attributeSetterDiv = this.attributeSetterDiv(id, option.innerText, roundType);
            if (attributeSetterDiv)
                attributeDiv.appendChild(attributeSetterDiv);
            else
                return;
            OptionDiv.appendChild(attributeDiv);
        });
        attributeSelectDiv.appendChild(attributeSelect);
        attributeSelectDiv.appendChild(addAttributeBtn);
        div.appendChild(topDiv);
        OptionDiv.appendChild(attributeSelectDiv);
        OptionDiv.appendChild(this.numInWithLabel(id, 'Base', roundType === null || roundType === void 0 ? void 0 : roundType.base));
        OptionDiv.appendChild(this.numInWithLabel(id, 'Threshold', roundType === null || roundType === void 0 ? void 0 : roundType.threshold));
        div.appendChild(OptionDiv);
        return div;
    }
    rowDiv(id) {
        const div = document.createElement('div');
        div.id = id;
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignContent = 'center'; // vertically center them
        return div;
    }
    columnDiv(id) {
        const div = document.createElement('div');
        div.id = id;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignContent = 'center'; // vertically center them
        return div;
    }
    attributeSetterDiv(id, attribute, values) {
        let value;
        switch (attribute) {
            case 'Over':
                value = values ? values.over : 0;
                break;
            case 'Lose Mult':
                value = values ? values.loseMod : 0;
                break;
            case 'Kaput Mult':
                value = values ? values.kaputMod : 0;
                break;
            case 'Threshold Solo':
                value = values ? values.kaputMod : 0;
                break;
            case 'Reverse Threshold':
                value = values ? values.reverse : false;
                break;
            case 'In Teams':
                value = values ? values.teamed : false;
                break;
            case 'Works in Trul':
                value = values ? values.overTrul : false;
                break;
            default:
                return;
        }
        if (typeof value === 'number')
            return this.numInWithLabel(id, attribute, value);
        else
            return this.checkWithLabel(id, attribute, value);
    }
    numInWithLabel(id, name, value = 0) {
        const div = document.createElement('div');
        div.id = `${this.htmlId}-divNumIn${name}${id}`;
        const InEl = document.createElement('input');
        InEl.type = 'number';
        InEl.value = String(value);
        InEl.id = `${this.htmlId}-In${name}${id}`;
        InEl.style.width = '10%';
        const LabelEl = document.createElement('label');
        LabelEl.htmlFor = InEl.id;
        LabelEl.id = `${this.htmlId}-labelNumIn${name}${id}`;
        LabelEl.innerText = `Over:`;
        LabelEl.style.marginRight = '5px';
        div.appendChild(LabelEl);
        div.appendChild(InEl);
        return div;
    }
    checkWithLabel(id, name, value = false) {
        const div = document.createElement('div');
        div.id = `${this.htmlId}-divCheck${name}${id}`;
        const InEl = document.createElement('input');
        InEl.type = 'checkbox';
        InEl.value = String(value);
        InEl.id = `${this.htmlId}-In${name}${id}`;
        InEl.style.width = '10%';
        const LabelEl = document.createElement('label');
        LabelEl.htmlFor = InEl.id;
        LabelEl.id = `${this.htmlId}-labelCheck${name}${id}`;
        LabelEl.innerText = `Over:`;
        LabelEl.style.marginRight = '5px';
        div.appendChild(LabelEl);
        div.appendChild(InEl);
        return div;
    }
}
