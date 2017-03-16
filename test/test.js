"use strict";
/**
 * Created by sdiemert on 2017-03-15.
 */

var assert = require("assert");
var qmdd = require("../qmdd");

describe("_Graph", function(){

    var G = null;

    beforeEach(function(){
        G = new qmdd._Graph();
    });

    afterEach(function(){
        G = null;
    });

    describe("#newNode",function(){
        it("should add a new node", function(){
            var i = G.newNode();
            assert.equal(G.nodes.length, 1);
            assert.equal(G.nodes[0].id, 0);
            assert.equal(i, 0);
        });

        it("should continue adding nodes", function(){
            var i1 = G.newNode();
            var i2 = G.newNode();

            assert.equal(G.nodes.length, 2);
            assert.equal(i1, 0);
            assert.equal(i2, 1);
        });
    });

    describe("#addEdge", function(){
        it("should add a new edge normally", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();

            var e = G.addEdge(n1, n2, 0, 1);

            assert.equal(e, 0);

            assert.equal(G.nodes.length, 2);

            assert.notEqual(G.nodes[n1].A[0], null);
            assert.equal(G.nodes[n1].A[0].id, 1);
            assert.equal(G.nodes[n1].W[0], 1);

            assert.equal(G.nodes[n1].A[1], null);
            assert.equal(G.nodes[n1].A[2], null);
            assert.equal(G.nodes[n1].A[3], null);

            assert.equal(G.nodes[n1].W[1], 0);
            assert.equal(G.nodes[n1].W[2], 0);
            assert.equal(G.nodes[n1].W[3], 0);

            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);

        });

        it("should fail when n1 is not a valid node", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(3, n2, 0, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

        it("should fail when n2 is not a valid node", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, 3, 0, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

        it("should fail if n1 is null", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(null, n2, 0, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

        it("should fail if n2 is null", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, null, 0, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

        it("should fail if e to small", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, n2, -1, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

        it("should fail if e is to large", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, n2, 4, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });


        it("should fail if e is null", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, n2, null, 1);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });


        it("should fail if w is null", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var r = G.addEdge(n1, n2, 2, null);

            // check result
            assert.equal(r, null);

            // check unchanged
            assert.deepEqual(G.nodes[n1].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n1].W, [0,0,0,0]);
            assert.deepEqual(G.nodes[n2].A, [null,null,null,null]);
            assert.deepEqual(G.nodes[n2].W, [0,0,0,0]);
        });

    });

    describe("#adjacent", function(){

        it("should return the weight if everything provided", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var e = G.addEdge(n1, n2, 2, 5);
            var r = G.adjacent(n1,n2,e);
            assert.equal(r, 5);
        });

         it("should return [e, w] tuple if no e provided", function(){
            var n1 = G.newNode();
            var n2 = G.newNode();
            var e = G.addEdge(n1, n2, 2, 5);
            var r = G.adjacent(n1,n2);
            assert.equal(r[0], 2);
            assert.equal(r[1], 5);
        });

         it("should return null if not adjacent", function(){
             var n1 = G.newNode();
             var n2 = G.newNode();
             var n3 = G.newNode();
             var e = G.addEdge(n1, n2, 2, 5);
             var r = G.adjacent(n1,n3);
             assert.equal(r, null);
         });

         it("should return null if not adjacent of edge e", function(){
             var n1 = G.newNode();
             var n2 = G.newNode();
             var e = G.addEdge(n1, n2, 2, 5);
             var r = G.adjacent(n1,n2, 3);
             assert.equal(r, null);
         });
    });

});

describe("Matrix", function(){

    describe("#constructor", function(){

        it("should initialize a root and terminal", function(){

            var M = new qmdd.Matrix(2);

            assert.notEqual(M._Q, null);
            assert.notEqual(M._Q, undefined);

            assert.equal(M._Q._size, 4);
            assert.equal(M._Q._root, 0);
            assert.equal(M._Q._term, 1);
            assert.equal(M._Q._rootMulti, 1);

            // check that the new edge is adjacent to everything.
            assert.equal(M._Q._G.adjacent(M._Q._root,M._Q._term,0), 0);
            assert.equal(M._Q._G.adjacent(M._Q._root,M._Q._term,1), 0);
            assert.equal(M._Q._G.adjacent(M._Q._root,M._Q._term,2), 0);
            assert.equal(M._Q._G.adjacent(M._Q._root,M._Q._term,3), 0);

        });
    });
});


describe("_QMDD", function(){


    describe("#_determineSequence", function(){

        it("should compute sequence for 4 x 4 case 1", function(){
            var Q = new qmdd._QMDD(4); // 2^2 x 2^2
            var S = Q._determineSequence(1,1);
            assert.equal(S.length, 2);
            assert.equal(S[0], 0);
            assert.equal(S[1], 3);
        });

        it("should compute sequence for 4 x 4 case 2", function(){
            var Q = new qmdd._QMDD(4);
            var S = Q._determineSequence(3,3);
            assert.equal(S.length, 2);
            assert.equal(S[0], 3);
            assert.equal(S[1], 3);
        });

        it("should compute sequence for 4 x 4 case 3", function(){
            var Q = new qmdd._QMDD(4);
            var S = Q._determineSequence(3,1);
            assert.equal(S.length, 2);
            assert.equal(S[0], 2);
            assert.equal(S[1], 3);
        });

        it("should compute sequence for 4 x 4 case 4", function(){
            var Q = new qmdd._QMDD(4);
            var S = Q._determineSequence(0,0);
            assert.equal(S.length, 2);
            assert.equal(S[0], 0);
            assert.equal(S[1], 0);
        });

        it("should handle a 8 x 8 case 1", function(){
            var Q = new qmdd._QMDD(8);
            var S = Q._determineSequence(0,0);
            assert.equal(S.length, 3);
            assert.equal(S[0], 0);
            assert.equal(S[1], 0);
            assert.equal(S[2], 0);
        });

        it("should handle a 8 x 8 case 1", function(){
            var Q = new qmdd._QMDD(8);
            var S = Q._determineSequence(4,3);
            assert.equal(S.length, 3);
            assert.equal(S[0], 2);
            assert.equal(S[1], 1);
            assert.equal(S[2], 1);
        });


        it("should return null if row index is too small", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(-1, 1);
            assert.equal(s,null);
        });

        it("should return null if row index is too large", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(4, 1);
            assert.equal(s,null);
        });
        it("should return null if column index is too small", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(1, -1);
            assert.equal(s,null);
        });

        it("should return null if column index is too large", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(1, 4);
            assert.equal(s,null);
        });

        it("should return null if row index is null", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(null, 3);
            assert.equal(s,null);
        });
        it("should return null if column index is null", function(){
            var Q = new qmdd._QMDD(4);
            var s = Q._determineSequence(1, null);
            assert.equal(s,null);
        });
    });

    describe("#set", function(){

        var Q = null;

        beforeEach(function(){
            Q = new qmdd._QMDD(4);
        });

        afterEach(function(){
            Q = null;
        });

        it("should set a value", function(){
            Q.set(2,2,1);
            var v = Q.get(2,2);
            assert.equal(v, 1);
        });

        it("should set multiple values", function(){
            Q.set(2,2,1);
            Q.set(2,2,0.5);
            Q.set(2,2,0.25);
            var v = Q.get(2,2);
            assert.equal(v, 0.25);
        });

        it("should fail on r to small", function(){
            assert.equal(Q.set(-1, 2, 1), null);
        });
        it("should fail on r to large", function(){
            assert.equal(Q.set(4, 2, 1), null);
        });
        it("should fail on c to small", function(){
            assert.equal(Q.set(1, -1, 1), null);
        });
        it("should fail on c to large", function(){
            assert.equal(Q.set(1, 4, 1), null);
        });
        it("should fail on c NaN", function(){
            assert.equal(Q.set(1, 2, "foo"), null);
        });
        it("should fail on r NaN", function(){
            assert.equal(Q.set("foo", 2, 1), null);
        });
        it("should fail on c NaN", function(){
            assert.equal(Q.set(1, "foo", 1), null);
        });

    });


});
