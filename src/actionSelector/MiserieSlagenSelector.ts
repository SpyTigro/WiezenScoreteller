export default class MiserieSlagenSelector {
    private checkedP: Array<boolean> = new Array<boolean>(4);

    render(htmlId: string) {
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId
            document.body.appendChild(div);
        }
        div.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            div.appendChild(this.makeCheckDiv(htmlId, i));
        }
    }

    getSucceeds(): Array<boolean> {
        return this.checkedP;
    }

    private makeCheckDiv(htmlId: string, i: number): HTMLElement {
        let div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them

        let checkEl = document.createElement('input');
        checkEl.type = 'checkbox';
        checkEl.id = `${htmlId}-check-${i}`;
        checkEl.checked = this.checkedP[i];
        checkEl.addEventListener('change', e => {
            this.checkedP[i] = checkEl.checked;
        });

        let ilabelEl = document.createElement('label') as HTMLLabelElement;
        ilabelEl.htmlFor = checkEl.id;
        ilabelEl.id = `${htmlId}-check-ilabel${i}`;
        ilabelEl.style.marginRight = '5px';
        ilabelEl.innerText = `${i + 1}.`;



        div.appendChild(ilabelEl);
        div.appendChild(checkEl);
        return div
    }
}