const fs = require('fs');
const clone = require('clone');

class Vertex{
    constructor(_edges){
        this.edges = _edges;
    }

    remove_edge(vertex_number){
        let index = this.edges.indexOf(vertex_number);
        while (index != -1){
            this.edges.splice(index,1);
            index = this.edges.indexOf(vertex_number);
        }   
    }

    add_edge(vertex_number){
        this.edges.push(vertex_number);
    }

    is_connected(vertex_number){
        return this.edges.includes(vertex_number);
    }

    count_edges(){
        return this.edges.length;
    }
}

class Edge{
    constructor(_u,_v){
        this.v = _v;
        this.u = _u;
    }

    update_vertex(old_vertex,new_vertex){
        if(this.u == old_vertex){
            this.u = new_vertex;
        } else {
            this.v = new_vertex;
        }
    }
}

class AdjacencyList{
    constructor(_graph_string){
        this.vertexes = {};
        //_graph_string.pop()

        for (var vertex_row of _graph_string){
            vertex_row = vertex_row.split("\t");
            if(vertex_row == '') continue;    
            let vertex_number = vertex_row.splice(0,1);
            if(vertex_row.includes('')) vertex_row.pop();
            this.vertexes[vertex_number] = new Vertex(vertex_row);
        }
        this.stored_vertexes = clone(this.vertexes);
    }

    restore(){
        this.vertexes = clone(this.stored_vertexes);
    }

    collapse_vertex(old_vertex_number,new_vertex_number){
        let old_vertex = this.vertexes[old_vertex_number];
        let new_vertex = this.vertexes[new_vertex_number];
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
            Wait is that already done because we're iterating through them? Maybe. God why is this
            code so complex? */

            try{
                this.vertexes[vertex_number].add_edge(new_vertex_number);
            } catch(err){
                var i = 0;
            }
            
            new_vertex.add_edge(vertex_number);
            this.vertexes[vertex_number].remove_edge(old_vertex_number);    
        }
        //TODO this is horribly inefficient and probably wrong.
        //this.remove_from_all_vertexes(old_vertex_number);
        delete this.vertexes[old_vertex_number];
    }

    remove_from_all_vertexes(vertex_number){
        for(let number of Object.keys(this.vertexes)){
            this.vertexes[number].remove_edge(vertex_number);
        }
    }

    random_vertex() {
        var vertex_numbers = Object.keys(this.vertexes)
        return vertex_numbers[ vertex_numbers.length * Math.random() << 0];
    };

    collapse_two_vertexes(){
        let old_vertex = null;
        let new_vertex = null;

        while(old_vertex == new_vertex){
            old_vertex = this.random_vertex();
            new_vertex = this.random_vertex();
        }

        this.collapse_vertex(old_vertex, new_vertex);
    }

    count_edges(){
        let count = 0;
        for(let number of Object.keys(this.vertexes)){
            count += this.vertexes[number].length;
        }
    }

    count_vertexes(){
        return Object.keys(this.vertexes).length;
    }
}

class MinCutter{
    constructor(_graph_string){
        this.adj_list = new AdjacencyList(_graph_string);
    };

    try_mincut(){
        while (this.adj_list.count_vertexes() > 2){
           this.adj_list.collapse_two_vertexes()
        }
        return this.adj_list.vertexes[this.adj_list.random_vertex()].count_edges();
    }

    size_of_input(){
        return this.adj_list.count_vertexes();
    }

    find_mincut(attempts){
        let n = this.size_of_input();
        if (attempts == undefined){
           attempts = 10*(n^2);
        }
        let best_cut = 10000000;
        let new_cut = 0;
        for(let i = 0; i < attempts; i++){
            new_cut = this.try_mincut();
            if(new_cut < best_cut) best_cut = new_cut;
            this.adj_list.restore();
        }
        return best_cut;
    }
}

module.exports = {
    Vertex, Edge, AdjacencyList, MinCutter
}

/* let test_string = "1\t2\t5\t4\r\n2\t7\t5\t6\t1\t4\r\n3\t6\t5\t4\t7\r\n4\t1\t2\t3\t5\r\n5\t4\t3\t1\t2\t6\r\n6\t5\t2\t3\r\n7\t3\t2\r\n";
let small_minc = new MinCutter(test_string.split('\r\n'));
console.log(small_minc.find_mincut()); */

const contents = fs.readFileSync('kargerMinCut.txt', 'utf8').split('\r\n');
let minc = new MinCutter(contents)
console.log(minc.find_mincut(2));
