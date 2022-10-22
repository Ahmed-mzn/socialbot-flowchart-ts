import { Node } from "@baklavajs/core";

export class GoToEndNode extends Node {
    constructor() {
        super();
        this.type = "GoToEndNode";
        this.name = "GoToEnd";
        this.addInputInterface("input");
    }
}
