

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
}