// Ghaidaa Khan - 1706133
// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Transitive Closure Package
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//
var _v = [],
    _e = []; // note naming conventions in upload guide


// -----------------------------------------------------------------------
function _main() {
    // create a graph (default undirected)
    var g = new Graph();

    // set input graph properties (label, directed etc.)
    g.label = 'Exercise 8.4: 7 (Levitin, 3rd edition)';
    g.digraph = true;

    // use global input arrays _v and _e to initialize its internal data structures
    g.readGraph(_v, _e);

    // use printGraph() method to check graph
    g.printGraph();

    // perform breadth-first search and output stored result
    g.topoSearch(1); // 0 means DFS choice, while 1 means BFS choice of topological search
    document.write("<p>bfs_order: ", g.bfs_order, "</p>");

    // report connectivity status if available
    document.write("<p>", g.componentInfo(), "</p>");

    //output DFS-based transitive closure matrix
    g.DfsTC();
    document.write("<p> TC matrix by DFS:<br>");
    for (var i = 0; i < g.dfsTC.length; i++) {
        document.write(g.dfsTC[i], "<br>");
    }

    //output Warshall transitive closure matrix
    document.write("<p>TC matrix by Warshall-Floyd:<br>");
    g.warshallFloyd();
    for (var i = 0; i < g.warshallTC.length; i++) {
        document.write(g.warshallTC[i], "<br>");
    }

    //check if the graph is DAG (directed acyclic graph)
    document.write("<p>DAG: ", g.isDAG(), "</p>");

    //output floyed-distance matrix
    g.warshallFloyd();
    document.write("<p>Distance matrix<br>");

    for (var i = 0; i < g.floydD.length; i++) {
        document.write(g.floydD[i], "<br>");
    }

}


// -----------------------------------------------------------------------

function Vertex(v) {
    // published docs section (ref. assignment page)
    // for this section, strip line comments
    // no JSDOC comments in this section

    // base property fields from P1M1

    this.label = v.label; // ... complete from P1M1 (remove comment)
    this.visit = false; // vertex can be marked visited or "seen"
    this.adjacent = new List();

    // base member methods from P1M1
    this.adjacentByID = adjacentByIdImpl; // Get id of adjacent vertices in an array.
    this.incidentEdges = incidentEdgesImpl; // return target id of incident edges in array
    this.vertexInfo = vertexInfoImpl; // Get vertex details in a printable string
    this.insertAdjacent = insertAdjacentImpl;



}

// -----------------------------------------------------------------------

function Edge(vert_i, weight) {
    // published docs section (ref. assignment page)
    // for this section, strip line comments
    // no JSDOC comments in this section


    // base property fields

    this.target_v = vert_i; // ... complete from P1M1 (remove comment)
    this.weight = weight; //Edge weight/cost

    // base member methods


    // --------------------
    // more student fields next


    // --------------------
    // more student methods next

}


// -----------------------------------------------------------------------

function Graph() {
    // base property fields
    this.vert = []; // vertex list (an array of Vertex objects)
    this.nv = 0; // number of vertices
    this.ne = 0; // number of edges
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.weighted = false; // true if weighted graph, false otherwise (default unweighted)
    this.dfs_push = []; // DFS order output
    this.bfs_order = []; // BFS order output
    this.label = ""; // identification string to label graph
    this.connectedComp = 0; // number of connected comps set by DFS; 0 (default) for no info
    this.adjMatrix = []; // graph adjacency matrix to be created on demand

    // base member methods
    this.listVerts = listVertsImpl; // List graph vertices using info strings returned by Vertex methods
    this.readGraph = better_input; // default input reader method
    this.addEdge = addEdgeImpl3; // Insert an edge
    this.printGraph = printGraphImpl; // better printer function
    this.makeGraph = makeGraphImpl; // Create a graph
    this.dfs = dfsImpl; // DFS a connected component
    this.bfs = bfsImpl; // BFS a connected component
    this.makeAdjMatrix = makeAdjMatrixImpl3; // Create adjacency (or weight, if graph weighted) matrix
    this.isConnected = isConnectedImpl; // Test if graph is connected returning true, otherwise false
    this.componentInfo = componentInfoImpl; // Get printable connectivity info strings
    this.topoSearch = topoSearchImpl; // perform a topological search

    // transitive closure package 
    /**
    	Distance matrix of shortest paths, set after applying warshallFloyd.
    	Stores output of warshallFloyd call. 
    	@default [ ]
    */
    this.floydD = [];
    /**
    	Transitive closure matrix , set after applying warshallFloyd.
    	Stores output of last warshallFloyd call.
    	@default [ ]
    */
    this.warshallTC = [];
    /**
    	Transitive closure matrix , set after applying DfsTC.
    	Stores output of last DfsTC call.
    	@default [ ]
    */
    this.dfsTC = [];

    // student methods
    /**
    	Check if there is a path between two vertices in a digraph
    	@method
    */
    this.hasPath = hasPathImpl;
    /**
    	Get the length of the shortest path between two vertices in a weighted graph
    	@method
    */
    this.shortestPath = shortestPathImpl;
    /**
    	Test if the diagraph is DAG (Directed Acyclic Graph)
    	@method
    */
    this.isDAG = isDAGImpl;
    /**
    	Compute TC matrix if unweighed digraph, and distance matrix if weighted
    	@method
    */
    this.warshallFloyd = warshallFloydImpl;
    /**
    	Compute DFS-Based TC matrix
    	@method
    */
    this.DfsTC = dfsTCImpl;
}


// -----------------------------------------------------------------------
// functions used by methods of Graph and ancillary objects

// -----------------------------------------------------------------------
// begin student code section
// -----------------------------------------------------------------------

// transitive closure package 

function hasPathImpl() {
    return this.warshallTC[u_i][v_i] == 1 ? true : false;
}


// -----------------------------------------------------------------------
// published docs section (ref. assignment page)
// use starter6-based P1M1 code as-is (fixes/improvements OK)
// no JSDOC comments in this section (docs already published).
// -----------------------------------------------------------------------
function dfsTCImpl() {
    // for each vertex
    for (var i = 0; i < this.nv; i++) {
        //process vertex v
        var v = this.vert[i];

        // mark all vertices unvisited
        for (var p = 0; p < this.nv; p++) {
            this.vert[p].visit = false;
        }

        // create and init the corresponding row 
        this.dfsTC[i] = [];
        for (var j = 0; j < this.nv; j++)
            this.dfsTC[i][j] = 0;

        //perform DFS search for each adjacent to the vertex v by its ID
        var w = v.adjacentByID();
        for (var n = 0; n < w.length; n++)
            this.dfs(w[n]); //for each adjacent vertex call dfs()

        //traverse the vertices to check which is visited
        for (var k = 0; k < this.nv; k++) {
            //if visited set 1 in the corresponding TC matrix
            if (this.vert[k].visit) {
                this.dfsTC[i][k] = 1;
            }
        }
    }
}

function shortestPathImpl(u_i, v_i) {
    return this.floydD[u_i][v_i];
}

/**
	Check if the given graph is Directed Acyclic Graph
	@author Zahra Al Safwan
	@implements Graph#isDAG
	@returns {boolean} True if diagraph is DAG
*/
function isDAGImpl() {
    for (var i = 0, j = 0; i < this.warshallTC.length && j < this.warshallTC.length; i++, j++)
        if (this.hasPath(i, j))
            return false;
    return true;
}

function list_vert() {
    var i, v; // local vars
    for (i = 0; i < this.nv; i++) {
        v = this.vert[i];
        document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
            " - ADJACENCY: ", v.adjacentByID(), "<br>");
    }

    function warshallFloydImpl() {
        // implement the ADJACENCY matrix 
        this.makeAdjMatrix();

        //Fill  warshallTC[] and distance matrices (floydD[]) by adjacent matrix
        for (var k = 0; k < this.adjMatrix.length; k++) {
            //Copy row by row
            this.warshallTC[k] = this.adjMatrix[k].slice();
            this.floydD[k] = this.adjMatrix[k].slice();
            for (var x = 0; x < this.nv; x++) {
                if (this.adjMatrix[k][x] == 0 && k != x) {
                    this.floydD[k][x] = Infinity;
                }
            }
        }

        // warshall-Floyed algorithm
        for (var k = 0; k < this.floydD.length; k++) {
            for (var i = 0; i < this.floydD.length; i++) {
                for (var j = 0; j < this.floydD.length; j++) {
                    this.floydD[i][j] = Math.min(this.floydD[i][j], (this.floydD[i][k] + this.floydD[k][j]));
                    this.warshallTC[i][j] = this.warshallTC[i][j] || (this.warshallTC[i][k] && this.warshallTC[k][j]) ? 1 : 0;
                }
            }
        }

        //change the value from Infinity to 0 (because there is no distance = Infinity)
        for (var i = 0; i < this.floydD.length; i++)
            for (var j = 0; j < this.floydD.length; j++)
                if (this.floydD[i][j] == Infinity)
                    this.floydD[i][j] = 0;

    }


}

/*
* find user by email
* @sync
* @method 
* @param {String} email ghaidaaaa.k@gmail.com
* @returns {User} object
* @throws {NotFoundError} user not found 
*\


