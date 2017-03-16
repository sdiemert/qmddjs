"use strict";
/**
 * Created by sdiemert on 2017-03-15.
 */

function _Node(id){
    // Adjacent nodes (in order)
    this.A = [null,null,null,null];
    // Weights for adjacent nodes (in order)
    this.W = [null,null,null,null];
}

_Node.prototype.addEdge = function(tar, e, w){
    this.A[e] = tar;
    this.W[e] = w;
};

function _Graph(){
    this.nodes = [];
}

_Graph.prototype.addNode = function(id){
    this.nodes.push(new _Node(id));
    return id;
};

_Graph.prototype.newNode = function(id){
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
    this.nodes[n1].addEdge(this.nodes[n2], e, w);
};

function QMDD(){
    this.G = new _Graph();
    this.G.newNode();
    this.rootMulti = 1;
}



// ---------------  Driver --------------

var Q = new QMDD();
