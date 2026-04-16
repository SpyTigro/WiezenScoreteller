export default class StandardSlagenSelector{
    private slagen: number = 0;

    render(htmlId: string){
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        div.className = '';

        this.makeSlagenSlider(htmlId, 'Slagen gehaald', div);
    }

    getSlagen(): number {
        return this.slagen;
    }

    private makeSlagenSlider(htmlId: string, label: string, div?: HTMLElement): HTMLElement {
        if(!div) div = document.createElement('div');

        let numInEl = document.createElement('input');
        numInEl.type = 'number';
        numInEl.id = `${htmlId}-slagen-num`;
        numInEl.min = '0';
        numInEl.max = '13';
        numInEl.value = String(this.slagen);

        let sliderEl = document.createElement('input');
        sliderEl.type = 'range';
        sliderEl.id = `${htmlId}-slagen-slider`;
        sliderEl.min = '0';
        sliderEl.max = '13';
        sliderEl.value = String(this.slagen);

        numInEl.addEventListener('input', e => {
            this.slagen = Number(numInEl.value);
            if(this.slagen > 13) this.slagen = 13;
            else if(this.slagen < 0) this.slagen = 0;
            numInEl.value = String(this.slagen);
            sliderEl.value = String(this.slagen);
        });
        sliderEl.addEventListener('input', e => {
            this.slagen = Number(sliderEl.value);
            numInEl.value = String(this.slagen);
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