# QMDD Package

A JavaScript library for Quantum Matrix Decision Diagrams.

Useful for sparse matrix operations.
 
Sparse matrices show up in a number of applications. I am writing this package to support a Quantum Turing Machine (QTM) simulator.
 
QTM operations are represented as large (O(c^n) where c is constant and n is size of tape) matrices, but they are fairly spare (mostly zeros), it is possible to improve performance by using data structures that efficiently represent sparse matrices, e.g. QMDD.
    
There are a number of QMDD packages in other languages, however (at the time of writing this) I could not find anything for JavaScript. 

The package represents matrices square (2^n x 2^n) matrices as decision diagrams, results in reduced space complexity and time complex for typical matrix operations. 


**This is a work a in progress. I am still working out the best algorithms for storage, retrieval, and basic matrix operations.**