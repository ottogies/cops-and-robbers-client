import { Vertex } from "./vertex.js";

export class Agent {

    constructor(container, id, role, vertex){
        this.id = id;
        this.vertex = vertex; 
        
        this.div = document.createElement("div");
        this.div.setAttribute("type", "agent");
        this.div.setAttribute("role", role);
        this.div.setAttribute("agent_id", this.id);

        container.append(this.div);

        this.div.className = "agent";
        this.div.classList.add(role);

        this.div.style.transform = "translateX(-50%) translateY(-50%)";
        this.div.style.zIndex = "10";
       
        this.setPosition(vertex);
        
   }


    // getX() {
    // return this.vertex.x;
    // }
    // getY() {
    // return this.vertex.y;
    // }

    setPosition (vertex) {
        this.position = vertex;
        this.div.style.left = vertex.x + "px";
        this.div.style.top = vertex.y + "px";
        
    }

    setActive(value) {
        if (value) {
            this.div.classList.add('active');
        }
        else {
            this.div.classList.remove('active');
        }
    }

    remove() {
        this.div.classList.add('vanish');
        // Do animation
        setTimeout(() => {
            this.div.remove();
        }, 1000)
    }


}