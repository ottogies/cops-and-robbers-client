import { Agent } from "./agent.js";

export class Cop extends Agent {

  constructor(container, id, vertex){
    super(container, id, 'cop', vertex);
  }

}