import { Node } from "@baklavajs/core";

export class SwitchNode extends Node {
    constructor() {
        super();
        this.type = "تحويل إجابة العميل";
        this.name = "تحويل إجابة العميل";
        this.cases = 0;
        this.addInputInterface("input")
        this.addOption("Operation", "SelectOption", "Equals", undefined, {
            items: ["Equals", "Not Equals", "Contains"]
        });
        this.addOption("Cases number", "IntegerOption", 1, undefined, {min:1});
        this.addOption("Case 1", "InputOption", "");
        this.addOutputInterface("Case 1");
        this.addOutputInterface("Else");


        this.events.update.addListener(this, (p) => {
            if(p.name == "Cases number" && p.option.optionComponent == "IntegerOption"){

                let cases = this.interfaces.size;

                let check = cases - p.option.value - 2;

                
                if( check < 0 ){
                    for(let i =0; i< -check; i++){
                        this.addOption("Case "+(cases+i-1), "InputOption", "");
                        this.addOutputInterface("Case "+(cases+i-1));
                        this.cases++;
                    }
                }
                if( check > 0 ){
                    this.removeOption("Case "+(cases-2));
                    this.removeInterface("Case "+(cases-2));
                    this.cases--;
                }


                this.removeInterface("Else");
                this.addOutputInterface("Else");
            }
        });
    }
}
