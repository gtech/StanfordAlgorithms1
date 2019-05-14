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
     * @param {string} _graph_string A string of the form:
     *  <vertex number\t[connected_vertex1]\t[connected_vertex2...]\n...
     * @memberof AdjacencyList
     */
    constructor(_graph_string){
        this.vertexes = {};
        this.vertex_degrees = [];
        this.edge_counter = 0;

        //TODO We're not inputing lines 199 and 200, and 198 is ending before its last number
        this.remove_blanks(_graph_string);
        for (var vertex_row of _graph_string){
            //vertex_row = vertex_row.split("\t");
            vertex_row = vertex_row.match(/\d+/g).map(Number);
            let vertex_number = vertex_row.splice(0,1);
            this.remove_blanks(vertex_row);
            this.vertexes[vertex_number] = new Vertex(vertex_row);
            this.vertex_degrees[vertex_number] = vertex_row.length;
            this.edge_counter += vertex_row.length;
        }
        this.vertex_counter = this.count_vertexes();
        this.stored_vertexes = clone(this.vertexes);
    }

    remove_blanks(target_string){
        let blank = target_string.findIndex(x => x == '');
        while(blank != -1){
            target_string.splice(blank,1);
            blank = target_string.findIndex(x => x == '');
        }
    }

    /**
     *Restores the graph to its initial state at construction.
     *
     * @memberof AdjacencyList
     */
    restore(){
        //TODO Must repopulate this.vertex_degrees
        this.vertexes = clone(this.stored_vertexes);
        this.count_edges();
        this.count_vertexes();
        this.restore_degrees();
        let c = 0;
    }

    /**
     *Deletes the edge and vertex from the graph, and collapses it into the new super vertex.
     *
     * @memberof AdjacencyList
     */
    collapse_edge(){
        const edge = this.random_edge();
        const old_vertex_number = edge[0].toString();
        const new_vertex_number = edge[2];
        let old_vertex = this.vertexes[old_vertex_number];
        let new_vertex = this.vertexes[new_vertex_number];
        const previous_vertex_length = old_vertex.edges.length + new_vertex.edges.length;

        //add the old edges to the new super-node, and remove the self loops.
        new_vertex.edges = new_vertex.edges.concat(old_vertex.edges);
        new_vertex.edges = new_vertex.edges.filter(vertex => 
            (vertex != old_vertex_number && vertex != new_vertex_number)
            );
        this.edge_counter -= (previous_vertex_length - new_vertex.edges.length);
        
        
        /* Now we want to iterate through the connected vertexes and point their 
        old edges to the supernode. 
        This won't change the degree of the verts*/
        let looked_at_vertexes = [];
        for (const vertex of new_vertex.edges) {
            let adj_vertex = this.vertexes[vertex];
            //Don't do redundant searches of vertexes you have already visited.
            //This happens when there are multiple edges between two vertexes.
            if (looked_at_vertexes.includes(vertex)) continue;
            looked_at_vertexes.push(vertex);

            //Replace the old vertex with the new vertex in adjacent vertexes.
            try{
                adj_vertex.edges = adj_vertex.edges.map(vertex => { 
                    if(vertex == old_vertex_number) return new_vertex_number;
                                                    return vertex;});
            } catch{
                console.log('uh oh');
            }
            
        }

        /* Finally we want to update the counters.
        We also need to update the degree of the old_vertex and supernode 
        the update will be an update of the supernode's degree, and setting the old vertex's to 0*/
        this.vertex_degrees[new_vertex_number] = new_vertex.edges.length;
        this.vertex_degrees[old_vertex_number] = 0;
        this.vertex_counter -= 1;
        
        delete this.vertexes[old_vertex_number];
    }

    /**
     *Returns an array signifying a random edge.
     *
     * @returns {Array} [{string}The vertex number,
     * {number} the index of the edge in the vertex.edges array, 
     * {string} the target vertex number the edge ends at.]
     * @memberof AdjacencyList
     */
    random_edge() {
        /* In order to select an edge uniformly at random over a adjacency list, we need
     to take into account the degree of all the vertexes when accessing the edge by
     vertex index. So we maintain a count of the degrees of vertexes as we select and remove edges. */
        let cumulativeProbability = 0;
        let randomEdgeIndex = ((this.edge_counter-1) * Math.random() << 0);

        for(let degree_i = 1; degree_i < this.vertex_degrees.length ; degree_i++) {
            const currentProbability = cumulativeProbability + this.vertex_degrees[degree_i];
            if(currentProbability > randomEdgeIndex){
                let edge_index = randomEdgeIndex-cumulativeProbability;
                let edge = [degree_i, edge_index, this.vertexes[degree_i].edges[edge_index]];
                return edge;
            }
            cumulativeProbability = currentProbability;
        }
    };
    
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
        this.edge_counter = count;
        return count;
    }

    restore_degrees(){
        for(let number of Object.keys(this.vertexes)){
            this.vertex_degrees[number] = this.vertexes[number].edges.length;
        }
        return this.vertex_degrees;
    }

    count_vertexes(){
        let count = Object.keys(this.vertexes).length;
        this.vertex_counter = count;
        return count;
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
           this.adj_list.collapse_edge();
        }
        return this.adj_list.count_edges();
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
           attempts = 5*n;
        }
        let best_cut = 10000000;
        let new_cut = 0;
        for(let i = 0; i < attempts; i++){
            new_cut = this.try_mincut();
            if(new_cut < best_cut){
                best_cut = new_cut;
                console.log('found new cut '+ i + ' ' + best_cut.toString());
                fs.writeFileSync('./best_cut.txt', best_cut.toString(),function(err,data){
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                // var stream = fs.createWriteStream("best_cut.txt");
                // stream.once('open', function(fd) {
                //     stream.write(best_cut.toString());
                //     stream.end();
                // });
            }
            //Reset graph to initial state so we can run Karger's again.
            this.adj_list.restore();
        }
        return best_cut;
    }
}

module.exports = {
    Vertex, AdjacencyList, MinCutter
}
