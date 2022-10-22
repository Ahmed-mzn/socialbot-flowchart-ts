import { Node } from "@baklavajs/core";

export class SayImageNode extends Node {
    constructor() {
        super();
        this.type = "SayImageNode";
        this.name = "SayImage";
        this.addInputInterface("input")
        this.addOption("Image url", "InputOption", "");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
