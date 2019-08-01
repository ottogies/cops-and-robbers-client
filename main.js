import { Vertex } from "./app/vertex.js";
import { Edge } from "./app/edge.js";
import { Agent } from "./app/agent.js";
import { Game } from "./app/game.js";
import { MockClient } from "./app/mock-client.js";
import { Client } from "./app/client.js";
import { App } from "./app/app.js";

const app = new App();

// var myImage = new Image();
// myImage.src = 'images.jpg';
// document.body.appendChild(myImage);

// var graphnum ; 

// const X = 7;
// const Y = 7;

// const dx = [0,1,0,-1];
// const dy = [-1,0,1,0];

// var vertices = [];
// var agents = [];

// for (var x = 0; x < 7; x ++) {
//     for (var y = 0; y < 7; y ++) {
//         const xPos = x * 100 ;
//         const yPos = y * 100 ;
//         const index = x * 7 + y;
//         const tmp = x * 7 + y; 
        

//         for (var i = 0; i < 4; i ++) {
//             const neighbor_x = x + dx[i];
//             const neighbor_y = y + dy[i];

//             if (neighbor_x < 0 || neighbor_x >= X) continue;
//             if (neighbor_y < 0 || neighbor_y >= Y) continue;

//             const nXPos = neighbor_x * 100;
//             const nYPos = neighbor_y * 100;
            
//             vertices[index] = new Vertex(xPos+100,yPos+100)
//             vertices[index].addEdge(nXPos+100,nYPos+100);

//             //new DrawGraph(xPos + 100, yPos + 100, nXPos +100, nYPos + 100);   
  
//         }
//     }
// }

// new Agent(vertices[9]);

// // if(click){
// //     agents[tmp] = new Agent(vertices[1]);
// //     agent[tmp].setPosition(vertices[2]);
// // }
// // else{
// //     break; 
// // }


















// http://127.0.0.1:8080/index.html?