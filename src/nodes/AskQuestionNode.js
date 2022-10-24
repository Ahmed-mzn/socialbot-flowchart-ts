import { Node } from "@baklavajs/core";

export class AskQuestionNode extends Node {
    constructor() {
        super();
        this.type = "إرسال سؤال";
        this.name = "إرسال سؤال";
        this.addInputInterface("input")
        this.addOption("Text", "TextareaOption", "your question ? ");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
