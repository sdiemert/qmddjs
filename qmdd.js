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
        this._G.addEdge(R, m, s, 1);
        M.push(1);
        this._set(x,S,M,m);
    }
};

_QMDD.prototype._get = function(S, M, R){

    var s = S[0];
    var A = this._G.getAdjacent(R, s);
    var w = A[1], a = A[0];
    M.push(w);

    if(S.length === 1){
        return M.reduce(function(a,b){return a*b;});
    }else{
        S.shift();
        if(w === 0){
            return 0;
        }else{
           return this._get(S, M, a);
        }
    }

};

_QMDD.prototype.set = function(r,c,x){

    if(isNaN(r) || r >= this._size || r < 0){
        return null;
    }

    if(isNaN(r) || c >= this._size || c < 0){
        return null;
    }

    if(isNaN(x)){
        return null;
    }

    var S = this._determineSequence(r,c);
    this._set(x,S,[],this._root);
};

/**
 * Get the value at matrix[r][c].
 * @param r {number} the row to look up (index from 0)
 * @param c {number} the column to look up (index from 0)
 */
_QMDD.prototype.get = function(r,c){
    var S = this._determineSequence(r,c);
    return this._get(S, [], this._root);
};

/**
 * Multiples this QMDD matrix with the parameter matrix.
 * Requires that this QMDD have the same size as Q1.
 *
 * @param Q1 {_QMDD}
 *
 * @return {_QMDD} A new _QMDD object that is the product.
 */
_QMDD.prototype.multiply = function(Q1){

    // Start with edges e0 (this), e1 (Q1)
    // If e1 -> Q1.terminal swap

};

/**
 *
 * @param e {number}
 * @param q0 {_Node}
 * @param Q0 {_QMDD}
 * @param q1 {_Node}
 * @param Q1 {_QMDD}
 * @param q2 {_Node}
 * @param Q2 {_QMDD}
 * @private
 */
_QMDD.prototype._add = function(e, q0, Q0, q1, Q1, q2, Q2){

    var qp0, qp1, qp2;

    if(e === null){
        qp0 = q0;
        qp1 = q1;
        qp2 = q2;
    }else{
        qp0 = q0.A[e];
        qp1 = q1.A[e];
        qp2 = null;
    }

    if(qp0.id === Q0._term && qp1.id === Q1._term){
        q2.W[e] = q0.W[e] + q1.W[e];
    }else{

        if(qp2 === null) {
            var qp2_id = Q2._G.newNode(); // id of new node
            qp2        = Q2._G.nodes[qp2_id]; // reference to _Node object

            //initalize the new node to all zeros
            Q2._G.addEdge(qp2_id, Q2._term, 0, 0);
            Q2._G.addEdge(qp2_id, Q2._term, 1, 0);
            Q2._G.addEdge(qp2_id, Q2._term, 2, 0);
            Q2._G.addEdge(qp2_id, Q2._term, 3, 0);

            // hook up the new node to its parent.
            Q2._G.addEdge(q2.id, qp2_id, e, 1);
        }

        for(var i = 0; i < 4; i++){

            if(qp0.W[i] === 0 && qp1.W[i] === 0){
                continue;
            }else if(qp0.W[i] !== 0 && qp1.W[i] === 0){
                // copy the sub-QMDD starting at qp0 as root.
                Q0.copy(Q2, qp2, qp0, i);
            }else if(qp0.W[i] === 0 && qp1.W[i] !== 0){
                // copy the sub-QMDD starting at qp1 as root.
                Q1.copy(Q2, qp2, qp1, i);
            }else{
                Q2._G.addEdge(qp2_id, Q2._G._term, i, 1);
                this._add(i, qp0, Q0, qp1, Q1, qp2, Q2);
            }
        }
    }
};

_QMDD.prototype.copy = function(Q, qt, qs, e){

    // copy everything in this QMDD to Q starting at qs in this and qt in Q
    // assume that qt(e) is pointing at terminal with weight 0.

    // if qs on edge e is pointing at the terminal.
    if(qs.A[e].id === this._term){
        // assign the weight to qt on edge e
        qt.W[e] = qs.W[e];
        qt.A[e] = Q._G.nodes[Q._term]; // assign terminal, just in case.
    }else{
        // qs on edge e is not pointing at a terminal node.
        // create a new node and join it to qt on edge e with
        // with weight from qs[e]
        // iterate over each edge of the node pointed to by qs[e]
        //  recurse for each with qs = v(qs[e]) and new node.

        var nn_id = Q._G.newNode();
        var nn = Q._G.nodes[nn_id];

        Q._G.addEdge(qt.id, nn_id, e, qs.W[e]);

        for(var i = 0; i < 4; i++){
            this.copy(Q, nn, qs.A[e], i);
        }
    }
};

/**
 * Adds this QMDD matrix with the parameter matrix.
 * Requires that this QMDD have the same size as Q1.
 *
 * @param Q1 {_QMDD}
 * @param Q2 {_QMDD}
 *
 * @return {_QMDD}
 */
_QMDD.prototype.add = function(Q1, Q2){

    this._add(null, this._G.nodes[this._root], this, Q1._G.nodes[Q1._root], Q1, Q2._G.nodes[Q2._root], Q2);
    return Q2;
};

/**
 * Makes a new matrix that is 2^m x 2^m in size.
 * Initializes everything to zeros.
 * @param m {number} m > 0
 * @constructor
 */
function Matrix(m){
    this._size = m;
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


/**
 * Gets the value at Matrix[r][c]
 *
 * @param r {number} row (index from 0)
 * @param c {number} column (index from 0)
 */
Matrix.prototype.get = function(r,c){
    return this._Q.get(r,c);
};

/**
 * Returns a 2D array of matrix.
 *
 * NOTE: doing this for large matrices may result in high memory usage.
 *       as it is required to populate all of the zero values.
 *
 * @return {Array} The matrix in array form
 */
Matrix.prototype.asArray = function(){

    // This is a dumb approach, just enumerates all n^2 options
    // with get, we can probably do something better...

    var R = [];

    for(var i = 0; i < this._Q._size; i++){
        R.push([]);
        for(var j = 0; j < this._Q._size; j++){
            R[i].push(this.get(i,j));
        }
    }

    return R;
};

/**
 * Returns a pretty string version of the matrix,
 * the string is padded with new line chars on either side.
 *
 * NOTE: doing this for large matries may result in high memory
 *       usage as it is required to enumerate all zero values.
 *
 * @param p {number} precision to print to, defaults to 2
 *
 * @return {string} pretty formatted matrix string.
 */
Matrix.prototype.asPrettyString = function(p){

    // This is a dumb approach, just enumerates all n^2 options
    // with get, we can probably do something better...
    // See approach is Matrix.prototype.asArray()

    p = p || 2;

    var R = "\n";

    for(var i = 0; i < this._Q._size; i++){
        for(var j = 0; j < this._Q._size; j++){
            R += this.get(i,j).toFixed(p) +" ";
        }
        R += "\n";
    }
    return R;
};

/**
 * Adds this matrix to the provided matrix, returns a new
 * Matrix object containing the result.
 * @param M1 {Matrix} matrix to add to this matrix, must be the same size.
 * @returns {Matrix} a new matrix containing the sum.
 */
Matrix.prototype.add = function(M1){

    if(M1._size !== this._size) return null;

    var M2 = new Matrix(this._size);
    this._Q.add(M1._Q, M2._Q);
    return M2;
};

Matrix.prototype.copy = function(){

    // returns a copy of this matrix
    // as a new Matrix object.

    var M = new Matrix(this._size);

    // copy each child of the root.
    this._Q.copy(M._Q, M._Q._G.nodes[M._Q._root], this._Q._G.nodes[this._Q._root], 0);
    this._Q.copy(M._Q, M._Q._G.nodes[M._Q._root], this._Q._G.nodes[this._Q._root], 1);
    this._Q.copy(M._Q, M._Q._G.nodes[M._Q._root], this._Q._G.nodes[this._Q._root], 2);
    this._Q.copy(M._Q, M._Q._G.nodes[M._Q._root], this._Q._G.nodes[this._Q._root], 3);

    return M;
};

module.exports._Graph = _Graph;
module.exports._QMDD = _QMDD;
module.exports.Matrix = Matrix;