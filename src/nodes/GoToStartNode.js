import { Node } from "@baklavajs/core";

export class GoToStartNode extends Node {
    constructor() {
        super();
        this.type = "إذهب للبداية";
        this.name = "إذهب للبداية";
        this.addInputInterface("input")
    }
}
