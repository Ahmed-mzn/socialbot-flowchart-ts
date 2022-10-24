import { Node } from "@baklavajs/core";

export class GoToEndNode extends Node {
    constructor() {
        super();
        this.type = "إذهب لخدمة العملاء";
        this.name = "إذهب لخدمة العملاء";
        this.addInputInterface("input");
    }
}
