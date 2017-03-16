"use strict";
/**
 * Created by sdiemert on 2017-03-15.
 */

function F1(n){
    var r = 1;
    for(var i = 0; i < n; i++){
       r += Math.pow(4,i);
    }
    return r;
}

function F2(n){
    return Math.pow(2,n) * Math.pow(2,n);
}

for(var i = 0; i <= 100; i++){
    console.log(F1(i), F2(i), parseFloat(F1(i))/F2(i));
}