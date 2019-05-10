const fs = require('fs');
const clone = require('clone');

/**
 *
 *
 * @class Vertex
 */
class Vertex{
    /**
     *Creates an instance of Vertex.
     * @param {Array} _edges The elements are numbers of the connected vertexes.
     * @memberof Vertex
     */
    constructor(_edges){
        this.edges = _edges;
    }

    /**
     *Removes all vertex numbers from the edges array that match vertex_number
     *
     * @param {string} vertex_number The vertex number to remove.
     * @memberof Vertex
     */
    remove_edge(vertex_number){
        let index = this.edges.indexOf(vertex_number);
        while (index != -1){
            this.edges.splice(index,1);
            index = this.edges.indexOf(vertex_number);
        }   
    }

    /**
     *Adds the vertex number to the edges.
     *
     * @param {string} vertex_number
     * @memberof Vertex
     */
    add_edge(vertex_number){
        this.edges.push(vertex_number);
    }

    /**
     *Prints whether there are one or more edges to the given vertex represented by the number.
     *
     * @param {string} vertex_number
     * @returns Whether this vertex is connected to the described vertex.
     * @memberof Vertex
     */
    is_connected(vertex_number){
        return this.edges.includes(vertex_number);
    }

    /**
     *Returns the number of edges
     *
     * @returns {number} number of edges
     * @memberof Vertex
     */
    count_edges(){
        return this.edges.length;
    }
}


class AdjacencyList{
    /**
     *Creates an instance of AdjacencyList.
     * @param {string} _graph_string A string of the form <vertex number\t[connected_vertex1]\t[connected_vertex2...]\n...
     * @memberof AdjacencyList
     */
    constructor(_graph_string){
        this.vertexes = {};
        this.vertex_degrees = [];

        for (var vertex_row of _graph_string){
            vertex_row = vertex_row.split("\t");
            if(vertex_row == '') continue;    
            let vertex_number = vertex_row.splice(0,1);
            if(vertex_row.includes('')) vertex_row.pop();
            this.vertexes[vertex_number] = new Vertex(vertex_row);
            this.vertex_degrees[vertex_number] = vertex_row.length;
        }
        this.stored_vertexes = clone(this.vertexes);
    }

    /**
     *Restores the graph to its initial state at construction.
     *
     * @memberof AdjacencyList
     */
    restore(){
        this.vertexes = clone(this.stored_vertexes);
    }

    /**
     *Deletes the edge and vertex from the graph, and collapses it into the new super vertex.
     *
     * @param {string} old_vertex_number vertex to delete
     * @param {string} new_vertex_number new super-vertex
     * @memberof AdjacencyList
     */
    collapse_vertex(old_vertex_number,new_vertex_number){
        let old_vertex = this.vertexes[old_vertex_number];
        let new_vertex = this.vertexes[new_vertex_number];

        //add the old edges to the new super-node, and remove the self loops.
        new_vertex.edges = new_vertex.edges.concat(old_vertex.edges);
        new_vertex.edges.filter(vertex => 
            (vertex != old_vertex_number && vertex != new_vertex_number)
            );
        
        for( let vertex_number of old_vertex.edges){
            
            //remove self loops
            if(vertex_number == new_vertex_number){
                new_vertex.remove_edge(old_vertex_number);
                continue;
            }
            /* 
            TODO We have to add all duplicate edges as well, just like we're removing them.
            So if we have 3 duplicate edges on our old_vertex to our vertex_number,
            we need to add all of those to the vertex_number and to new_vertex. 
            Wait is that already done because we're iterating through them? 
            
            It seems like we can do all of this functionally.*/

            try{
                this.vertexes[vertex_number].add_edge(new_vertex_number);
            } catch(err){
                var i = 0;
            }
            
            new_vertex.add_edge(vertex_number);
            this.vertexes[vertex_number].remove_edge(old_vertex_number);    
        }
        delete this.vertexes[old_vertex_number];
    }

    /**
     *Remove the edges that point to the given vertex from all vertexes in the graph.
     This is stupid, don't use this.
     *
     * @param {string} vertex_number
     * @memberof AdjacencyList
     */
    remove_from_all_vertexes(vertex_number){
        for(let number of Object.keys(this.vertexes)){
            this.vertexes[number].remove_edge(vertex_number);
        }
    }

    /**
     *Returns a random vertex from the graph.
     *
     * @returns {string}
     * @memberof AdjacencyList
     */
    random_vertex() {
        var vertex_numbers = Object.keys(this.vertexes)
        return vertex_numbers[ vertex_numbers.length * Math.random() << 0];
    };

    /**
     *Collapse a random two vertexes into a super-vertex.
     *
     * @memberof AdjacencyList
     */
    collapse_two_vertexes(){
        //TODO this should collapse an edge not a vertex, this will not be random over edges.
        let old_vertex = null;
        let new_vertex = null;

        while(old_vertex == new_vertex){
            old_vertex = this.random_vertex();
            new_vertex = this.random_vertex();
        }

        this.collapse_vertex(old_vertex, new_vertex);
    }

    
    /**
     *Return the number of edges in the graph.
     *
     * @returns {number} The number of edges in the graph.
     * @memberof AdjacencyList
     */
    count_edges(){
        let count = 0;
        for(let number of Object.keys(this.vertexes)){
            count += this.vertexes[number].edges.length;
        }
        return count;
    }

    count_vertexes(){
        return Object.keys(this.vertexes).length;
    }
}

class MinCutter{
    constructor(_graph_string){
        this.adj_list = new AdjacencyList(_graph_string);
    };

    /**
     *Run Karger's algorithm.
     *
     * @returns {number} 1/n^2 likely the number of edges in the minimum cut.
     * @memberof MinCutter
     */
    try_mincut(){
        while (this.adj_list.count_vertexes() > 2){
           this.adj_list.collapse_two_vertexes()
        }
        return this.adj_list.vertexes[this.adj_list.random_vertex()].count_edges();
    }

    size_of_input(){
        return this.adj_list.count_vertexes();
    }

    /**
     *Run Karger's algorithm a default of 5*n^2 times and 
     return the probable minimum cut of the graph.
     *
     * @param {number} attempts Optional number of times to run the algorithm before returning.
     * @returns {number} The probable number of edges in the minimum cut.
     * @memberof MinCutter
     */
    find_mincut(attempts){
        let n = this.size_of_input();
        if (attempts == undefined){
           attempts = 5*(n^2);
        }
        let best_cut = 10000000;
        let new_cut = 0;
        for(let i = 0; i < attempts; i++){
            new_cut = this.try_mincut();
            if(new_cut < best_cut) best_cut = new_cut;
            //Reset graph to initial state so we can run Karger's again.
            this.adj_list.restore();
        }
        return best_cut;
    }
}

module.exports = {
    Vertex, AdjacencyList, MinCutter
}

/* 
TODO figure how to automate testing in VScode so I don't have to do this to debug.
let test_string = "1\t2\t5\t4\r\n2\t7\t5\t6\t1\t4\r\n3\t6\t5\t4\t7\r\n4\t1\t2\t3\t5\r\n5\t4\t3\t1\t2\t6\r\n6\t5\t2\t3\r\n7\t3\t2\r\n";
let small_minc = new MinCutter(test_string.split('\r\n'));
console.log(small_minc.find_mincut()); */

/* const contents = fs.readFileSync('kargerMinCut.txt', 'utf8').split('\r\n');
let minc = new MinCutter(contents)
console.log(minc.find_mincut(2)); */
