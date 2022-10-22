import { Node } from "@baklavajs/core";

export class SallaNode extends Node {
    constructor() {
        super();
        this.type = "SallaNode";
        this.name = "Salla";
        this.addInputInterface("input")
        this.addOutputInterface("Next");
    }

    calculate() {
        this.getInterface("Next").value = "user unput";
    }
}
