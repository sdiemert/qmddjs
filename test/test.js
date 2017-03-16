"use strict";
/**
 * Created by sdiemert on 2017-03-15.
 */

var assert = require("assert");
var qmdd = require("../qmdd");

describe("_Graph", function(){
    describe("#addNode",function(){
        it("should add a new node", function(){

            var G = new qmdd._Graph();
            G.addNode(0);
            assert.equal(G.nodes.length, 1);
            assert.equal(G.nodes[0].id, 1);

        });
    });
});
