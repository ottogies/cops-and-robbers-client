import { Edge } from "./edge.js";

export class Vertex { 

    constructor(container,id,x,y){
        this.id = id;
        this.x = x; 
        this.y = y;

        this.edges = [];
        this.edgeMap = new Map();

        this.div = document.createElement("div");
        this.div.setAttribute("type", "vertex");
        this.div.setAttribute("vertex_id", this.id);

        this.div.className = "vertex";
        this.div.style.left = x +"px";
        this.div.style.top = y + "px";

        container.append(this.div);
        this.div.classList.add('animate');
    
    }

    addEdge(container, vertex) { 
        const edge = new Edge(container, this.x,this.y,vertex.x,vertex.y);
        this.edges.push(vertex);
        this.edgeMap.set(vertex.id, edge);
    }

    getEdge(dstVertexId) {
        return this.edgeMap.get(+dstVertexId);
    }

    setColor(color) {
        this.div.style.backgroundColor = color;
    }
    
    setHighlight(value){
        if (value) this.div.classList.add('highlight');
        else this.div.classList.remove('highlight');
    }

    setWeight(value) {
        this.div.style.background = `rgb(${125 + Math.round(value * 125)}, ${125 + Math.round(value * 125)}, ${125 + Math.round(value * 125)})`;
    }

}
