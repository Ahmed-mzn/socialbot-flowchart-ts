import { Node } from "@baklavajs/core";

export class StartNode extends Node {
    constructor() {
        super();
        this.type = "StartNode";
        this.name = "Start";
        // this.addOption("Start Text", "InputOption", "Hi, am chatbot");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "input";
    }
}
