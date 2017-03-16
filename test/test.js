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

            G.addEdge(n1, n2, 0, 1);

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

});
