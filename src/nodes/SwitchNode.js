import { Node } from "@baklavajs/core";

export class SwitchNode extends Node {
    constructor() {
        super();
        this.type = "SwitchNode";
        this.name = "SwitchNode";
        this.cases = 0;
        this.addInputInterface("input")
        this.addOption("Operation", "SelectOption", "Equals", undefined, {
            items: ["Equals", "Not Equals", "Contains"]
        });
        this.addOption("Cases number", "IntegerOption", 1, undefined, {min:1});
        this.addOption("Case 1", "InputOption", "");
        this.addOutputInterface("Case 1");


        this.events.update.addListener(this, (p) => {
            if(p.name == "Cases number" && p.option.optionComponent == "IntegerOption"){

                let cases = this.interfaces.size;

                let check = cases - p.option.value - 1;
                
                if( check < 0 ){
                    this.addOption("Case "+cases, "InputOption", "");
                    this.addOutputInterface("Case "+cases);
                    this.cases++;
                } else {
                    this.removeOption("Case "+(cases-1));
                    this.removeInterface("Case "+(cases-1));
                    this.cases--;
                }
            }
        });
    }
}
