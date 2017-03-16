/**
 * Created by sdiemert on 2017-03-15.
 */

var Matrix = require("./qmdd").Matrix;


var M = new Matrix(2);

//console.log(M);

M.set(0,0,1);
M.set(1,1,0.75);
M.set(2,2,0.50);
M.set(3,3,0.25);

console.log("get(0,0)", M.get(0,0));
console.log("get(1,1)", M.get(1,1));
console.log("get(2,2)", M.get(2,2));
console.log("get(3,3)", M.get(3,3));

console.log("node count:", M._Q._G.nodes.length);

console.log(M.asPrettyString());
