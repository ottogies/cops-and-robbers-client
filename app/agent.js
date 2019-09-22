import { Vertex } from "./vertex.js";

export class Agent {

    constructor(container, id, role, vertex){
        this.id = id;
        this.role = role;
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

        const label = document.createElement('div');
        label.classList.add('label');
        label.innerText = 'Agent';

        this.div.append(label);
        
   }


    // getX() {
    // return this.vertex.x;
    // }
    // getY() {
    // return this.vertex.y;
    // }

    setPosition (vertex) {
        if (this.position) this.position.removeAgent(this);
        this.position = vertex;
        this.div.style.left = vertex.x + "px";
        this.div.style.top = vertex.y + "px";
        vertex.addAgent(this);
    }

    setActive(value) {
        if (value) {
            this.div.classList.add('active');
        }
        else {
            this.div.classList.remove('active');
        }
    }

    setPath(path) {
        console.log(this,path);
        this.path = path;
    }

    setVertices(vertices) {
        console.log(this,vertices);
        this.vertices = vertices;
    }

    highlightPath() {
        if (this.path) {
            for (var i = 2; i < this.path.length; i ++) {
                const v1 = this.path[i - 1];
                const v2 = this.path[i];
                const e1 = v1.getEdge(v2.id);
                const e2 = v2.getEdge(v1.id);
                e1.div.classList.add('h');
                e2.div.classList.add('h');
            }
        }
        if (this.vertices) {
            this.vertices.forEach(v => v.div.classList.add('h'));
        }
    }

    setFog(value) {
        if (value) this.div.classList.add('fog');
        else this.div.classList.remove('fog');
        this.fog = value;
    }

    remove() {
        this.div.classList.add('vanish');
        // Do animation
        setTimeout(() => {
            this.div.remove();
        }, 1000)
    }


}