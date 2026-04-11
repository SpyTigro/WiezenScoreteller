import ActionMode from "./ActionMode.js";
import MiserieSlagenSelector from "./MiserieSlagenSelector.js";

export default class MiserieMode extends ActionMode{
    private slagenSelector: MiserieSlagenSelector = new MiserieSlagenSelector();

    constructor(name: string, base: number){
        super(name, 0, base, 0, 1, 4);
    }
    
    getScoreDelta(goingPlayers: Array<boolean>, deler: number): Array<number> {
        
        let scoreDelta = new Array<number>(goingPlayers.length);


        return scoreDelta;
    }
    
    getModeType(): string {
        return 'miserieMode';
    }
    
    renderSlagenSelector(htmlId: string){
        this.slagenSelector.render(htmlId);
    }
}