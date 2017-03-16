"use strict";
/**
 * Created by sdiemert on 2017-03-15.
 */

function _Node(id){
    // Adjacent nodes (in order)
    this.A = [null,null,null,null];
    // Weights for adjacent nodes (in order)
    this.W = [0,0,0,0];

    this.id = id;
}

_Node.prototype.addEdge = function(tar, e, w){

    if(e < 0 || e >= this.A.length || e === null || e === undefined){
        return null;
    }

    if(w === undefined || w === null){
        return null;
    }

    this.A[e] = tar;
    this.W[e] = w;

    return e;
};

function _Graph(){
    this.nodes = [];
}

_Graph.prototype.newNode = function(){
    var x = this.nodes.length;
    this.nodes.push(new _Node(x));
    return x;
};

/**
 *
 * @param n1 {number} parent
 * @param n2 {number} child
 * @param e {number} edge number, 0 - N
 * @param w {number} weight
 */
_Graph.prototype.addEdge = function(n1, n2, e, w){

    if(n1 === undefined || n1 === null || this.nodes[n1] === undefined || this.nodes[n1] === null){
        return null;
    }

    if(n2 === undefined || n2 === null || this.nodes[n2] === undefined || this.nodes[n2] === null){
        return null;
    }

    return this.nodes[n1].addEdge(this.nodes[n2], e, w);
};

function _QMDD(){
    this.G = new _Graph();
    this.G.newNode();
    this.rootMulti = 1;
}



// ---------------  Driver --------------

var Q = new _QMDD();


// ---------------- EXPORTS -------------

module.exports._Graph = _Graph;
module.exports._QMDD = _QMDD;
