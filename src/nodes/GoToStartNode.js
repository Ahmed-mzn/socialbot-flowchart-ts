import { Node } from "@baklavajs/core";

export class GoToStartNode extends Node {
    constructor() {
        super();
        this.type = "GoToStartNode";
        this.name = "GoToStart";
        this.addInputInterface("input")
    }
}
