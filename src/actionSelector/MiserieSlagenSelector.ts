export default class MiserieSlagenSelector{
    render(htmlId: string){
        let div = document.getElementById(htmlId);
        if (!div) {
            div = document.createElement('div');
            div.id = htmlId
            document.body.appendChild(div);
        }
        div.innerHTML = '';

        
    }
}