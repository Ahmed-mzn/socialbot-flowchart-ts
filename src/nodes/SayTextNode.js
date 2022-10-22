import { Node } from "@baklavajs/core";

export class SayTextNode extends Node {
    constructor() {
        super();
        this.type = "SayTextNode";
        this.name = "SayText";
        this.addInputInterface("input")
        this.addOption("Text", "TextareaOption", "How i can help");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
