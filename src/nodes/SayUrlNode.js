import { Node } from "@baklavajs/core";

export class SayUrlNode extends Node {
    constructor() {
        super();
        this.type = "SayUrlNode";
        this.name = "SayUrl";
        this.addInputInterface("input")
        this.addOption("Enter url", "InputOption", "");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
