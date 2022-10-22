import { Node } from "@baklavajs/core";

export class SayVideoNode extends Node {
    constructor() {
        super();
        this.type = "SayVideoNode";
        this.name = "SayVideo";
        this.addInputInterface("input")
        this.addOption("Video url", "InputOption", "");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
