export class Edge{

    constructor(container,x1,y1,x2,y2){

        this.x1 = x1;
        this.x2 = x2; 
        this.y1 = y1;
        this.y2 = y2;

        this.div = document.createElement("div");

        container.append(this.div);

        this.div.className = "edge";

        var dy = y2 - y1;
        var dx = x2 - x1;
        var distance = Math.pow(dx,2) + Math.pow(dy,2);

        var hdy = (y1+y2)/2;
        var hdx = (x1+x2)/2;
        
        
        var angle = (Math.atan2(dy,dx)*180)/Math.PI;

        this.div.style.left = (x1+x2)/2 +"px";
        this.div.style.top = (y1+y2)/2 +"px";
        this.div.style.width = Math.sqrt(distance)+ "px";

        if(dx == 0){
           
            var angle1 = 90;
            this.div.style.transform = `translateX(-50%) rotate(${angle1}deg)`;
           
        }
        else if(dy == 0){
            var angle2 = 180;
            this.div.style.transform = `translateX(-50%) rotate(${angle2}deg)`;
        }
        else{
            var angle3 = (Math.atan2(dy,dx)*180)/Math.PI;
            this.div.style.transform = `translateX(-50%) rotate(${angle3}deg)`;
        } 

        this.div.classList.add('animate');
    }
}