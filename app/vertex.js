import { Edge } from "./edge.js";

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.min(255,Math.round(r * 255)), Math.min(255,Math.round(g * 255)), Math.min(255,Math.round(b * 255))];
}

export class Vertex { 

    constructor(container,id,x,y){
        this.id = id;
        this.x = x; 
        this.y = y;

        this.edges = [];
        this.edgeMap = new Map();

        this.agents = new Set();

        this.div = document.createElement("div");
        this.div.setAttribute("type", "vertex");
        this.div.setAttribute("vertex_id", this.id);

        this.div.className = "vertex";
        this.div.style.left = x +"px";
        this.div.style.top = y + "px";

        container.append(this.div);
        this.div.classList.add('animate');

        this.haze = document.createElement('div');
        this.haze.classList.add('haze');
        this.div.append(this.haze);
    
        this.setFog(false);
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
        this.weight = value;
        this.toggleWeight(this.showWeight);
    }

    toggleWeight(value) {
        this.showWeight = value;
        if (value) {
            const rgb = hslToRgb((240 - this.weight * 240) / 360, 0.7, 0.7);
            this.div.style.background = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        }
        else {
            this.div.style.background = '';
        }
    }

    addAgent(agent) {
        this.agents.add(agent);
        this.update();
    }

    removeAgent(agent) {
        this.agents.delete(agent);
        this.update();
    }

    update() {
        let hasAgent = false;
        this.agents.forEach(agent => {
            if (!agent.fog) {
                hasAgent = true;
            }
        })
        if (hasAgent) this.div.classList.add('has-agent');
        else this.div.classList.remove('has-agent');
    }

    setTurn(value) {
        if (value) this.div.classList.add('turn');
        else this.div.classList.remove('turn');
    }

    setFog(value) {
        if (value) this.div.classList.add('fog');
        else this.div.classList.remove('fog');
        this.fog = value;
    }

}
