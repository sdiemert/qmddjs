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

_Node.prototype.adjacent = function(tar, e){
    if(e === undefined || e === null){
        for(var i = 0; i < this.A.length; i++){
            if(this.A[i] === null) continue;
            else if(this.A[i].id === tar.id){
                return [i, this.W[i]];
            }
        }
    }else{
        if(this.A[e] === null){
            return null
        } else if(this.A[e].id === tar.id){
            return this.W[e];
        }else{
            return null;
        }
    }
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

/**
 *
 * @param n1 {number} the source node of the edge
 * @param n2 {number} the target node of the edge
 * @param e {number} the edge number to look on
 * @returns {null|number|array} null if nothing found or error, the weight if e is provided, a tuple [e, w] if no weight
 */
_Graph.prototype.adjacent = function(n1, n2, e){

    if(n1 === undefined || n1 === null || n2 === undefined || n2 === undefined){
        return null;
    }

    if(e === null || e === undefined){
        return this.nodes[n1].adjacent(this.nodes[n2]);
    }else{
        return this.nodes[n1].adjacent(this.nodes[n2], e);
    }
};

_Graph.prototype.getAdjacent = function(n1, e){
    // TODO: Error checking and such here...
    return [this.nodes[n1].A[e].id, this.nodes[n1].W[e]];
};

/**
 * Makes a QMDD.
 * @param m {number} the size of the matrix the QMDD is representing, must be power of 2.
 * @private
 */
function _QMDD(m){
    this._G = new _Graph();
    this._root = this._G.newNode();
    this._term = this._G.newNode();
    this._rootMulti = 1;
    this._size = m;

    // initialize the root to point to the terminal node
    this._G.addEdge(this._root, this._term, 0, 0);
    this._G.addEdge(this._root, this._term, 1, 0);
    this._G.addEdge(this._root, this._term, 2, 0);
    this._G.addEdge(this._root, this._term, 3, 0);
}

/**
 * Determines the sequence of edges to traverse (0,1,2,3)
 * to reach a particular index in the matrix M[r][c] (row x col)
 * @param r {number} the row index (from 0)
 * @param c {number} the column index (from 0)
 * @returns {Array} the sequnce of edges to traverse
 * @private
 */
_QMDD.prototype._determineSequence = function(r,c){

    if(r == null || r === undefined || c === null || c === undefined){
        return null;
    }else if(r >= this._size || r < 0){
        return null;
    }else if(c >= this._size || c < 0){
        return null;
    }

    // Determines the sequence edges to take to achieve
    // a specific matrix index (row, column)

    var S = [];

    // this._size is a power of 2
    // we need to do log_2(size) iterations

    const iters = Math.log2(this._size);

    var q = null;

    for(var i = 0; i < iters; i++){
        // Compute the quadrant (0,1,2,3)
        q = 2*(r >= Math.pow(2, iters - i - 1)) + (c >= Math.pow(2, iters - i - 1));

        // Adjust the row and column numbers based on quadrant
        //  we are looking in in the next iteration
        if(q === 2 || q === 3){
            r = r - Math.pow(2, iters - i - 1);
        }
        if(q === 1 || q === 3){
            c = c - Math.pow(2, iters - i - 1);
        }

        // store as a member of the sequence
        S.push(q);
    }

    return S;
};

_QMDD.prototype._set = function(x,S,M,R){
    // R is the root we are working with.

    var s = S[0];

    if(S.length === 1){

        // base case, we have to be at terminal.
        // compute the weighted w that satisfies our requirements
        var wp = parseFloat(x) / M.reduce(function(a,b){return a*b;});
        this._G.addEdge(R,this._term,s,wp);
        return;
    }

    S.shift();

    var w = this._G.adjacent(R, this._term, s), a = null;

    if(w === null){
        // not adjacent to terminal node
        // find out what we are adjacent to
        // get it weight

        var A = this._G.getAdjacent(R, s);
        w = A[1];
        a = A[0];
        M.push(w);
        this._set(x,S, M, a)

    }else{
        // we are adjacent to terminal node.
        var m = this._G.newNode();
        this._G.addEdge(m,this._term, 0, 0);
        this._G.addEdge(m,this._term, 1, 0);
        this._G.addEdge(m,this._term, 2, 0);
        this._G.addEdge(m,this._term, 3, 0);
        var e = this._G.addEdge(R, m, s, 1);
        M.push(1);
        this._set(x,S,M,m);
    }
};

_QMDD.prototype._get = function(S, M, R){

    if(S.length === 1){
        var s = S[0];
        var A = this._G.getAdjacent(R, s);
        var w = A[1];
        M.push(w);

        return M.reduce(function(a,b){return a*b;});

    }else{
        var s = S[0];
        S.shift();
        var A = this._G.getAdjacent(R, s);
        var w = A[1];
        var a = A[0];
        M.push(w);

        if(w === 0){
            return 0;
        }else{
           return this._get(S, M, a);
        }
    }

};

_QMDD.prototype.set = function(r,c,x){
    var S = this._determineSequence(r,c);
    this._set(x,S,[],this._root);
};

_QMDD.prototype.get = function(r,c){
    var S = this._determineSequence(r,c);
    console.log(S);
    return this._get(S, [], this._root);
};

/**
 * Makes a new matrix that is 2^m x 2^m in size.
 * Initalizes everything to zeros.
 * @param m {number} m > 0
 * @constructor
 */
function Matrix(m){
    this._Q = new _QMDD(Math.pow(2, m));
}

/**
 * Sets the value of M[r][c] = x
 *
 * @param r {number} row in the matrix to set (indexed from 0)
 * @param c {number} col in the matrix to set (indexed from 0)
 * @param x {number} to set the value of M[r][c] = x
 */
Matrix.prototype.set = function(r,c,x){

    this._Q.set(r,c,x);

};


Matrix.prototype.get = function(r,c){
    return this._Q.get(r,c);
};
module.exports._Graph = _Graph;
module.exports._QMDD = _QMDD;
module.exports.Matrix = Matrix;
