import { Agent } from "./agent.js";

export class Cop extends Agent {

  constructor(id, vertex){
    super(id, 'cop', vertex);
  }

}