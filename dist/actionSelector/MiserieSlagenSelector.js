export default class MiserieSlagenSelector {
    constructor() {
        this.checkedP = new Array(4);
    }
    render(htmlId, players) {
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId;
            document.body.appendChild(div);
        }
        div.innerHTML = '';
        div.className = 'Selector';
        const pEl = document.createElement('p');
        pEl.innerText = 'Who succeeded?';
        div.appendChild(pEl);
        for (let i = 0; i < players.length; i++) {
            div.appendChild(this.makeCheckDiv(htmlId, players[i], i));
        }
    }
    getSucceeds() {
        return this.checkedP;
    }
    makeCheckDiv(htmlId, name, i) {
        let div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center'; // vertically center them
        let checkEl = document.createElement('input');
        checkEl.type = 'checkbox';
        checkEl.id = `${htmlId}-check-${name}`;
        checkEl.value = name;
        let labelEl = document.createElement('label');
        labelEl.htmlFor = checkEl.id;
        labelEl.innerText = name;
        if (checkEl.checked)
            labelEl.className = 'checked';
        else
            labelEl.className = 'check';
        checkEl.addEventListener('change', e => {
            this.checkedP[i] = checkEl.checked;
            if (checkEl.checked)
                labelEl.className = 'checked';
            else
                labelEl.className = 'check';
        });
        div.appendChild(checkEl);
        div.appendChild(labelEl);
        return div;
    }
}
