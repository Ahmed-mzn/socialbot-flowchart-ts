import { Node } from "@baklavajs/core";

export class AskQuestionNode extends Node {
    constructor() {
        super();
        this.type = "AskQuestionNode";
        this.name = "AskQuestion";
        this.addInputInterface("input")
        this.addOption("Text", "TextareaOption", "your question ? ");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
