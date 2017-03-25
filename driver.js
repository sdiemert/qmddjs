/**
 * Created by sdiemert on 2017-03-15.
 */

var Matrix = require("./qmdd").Matrix;

var M1 = new Matrix(1);
var M2 = new Matrix(1);

M1.set(0,0,1);
M1.set(1,1,1);
console.log(M1.asPrettyString());


M2.set(0,0,1);
M2.set(1,1,1);
console.log(M2.asPrettyString());

var M3 = M1.multiply(M2);

console.log(M3.asPrettyString());
