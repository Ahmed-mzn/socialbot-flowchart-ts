import { Node } from "@baklavajs/core";

export class SayUrlNode extends Node {
    constructor() {
        super();
        this.type = "إرسال رابط ملف";
        this.name = "إرسال رابط ملف";
        this.addInputInterface("input")
        this.addOption("Enter url", "InputOption", "");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
