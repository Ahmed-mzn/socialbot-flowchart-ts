import { Node } from "@baklavajs/core";

export class StartNode extends Node {
    constructor() {
        super();
        this.type = "البداية";
        this.name = "البداية";
        // this.addOption("Start Text", "InputOption", "Hi, am chatbot");
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "input";
    }
}
