const expect = require('chai').expect;
const fs = require('fs');



const programming3 = require('../programming3.js');
const AdjacencyList = programming3.AdjacencyList;
const Vertex = programming3.Vertex;
const MinCutter = programming3.MinCutter;

describe('programming3.js', function(){
    it('should exist', function(){       
        expect(programming3).to.not.be.undefined;
    });
});

describe('#Vertex', function(){
    it('should exist', function(){
        let vertex = Vertex;
        expect(vertex).to.not.be.undefined;
    })
})

const kargerMinCutGraphString = fs.readFileSync('kargerMinCut.txt', 'utf8').split('\r\n');
const small_graph_string = "1\t2\t5\t4\r\n2\t5\t6\t1\t4\r\n3\t6\t5\t4\t7\r\n4\t1\t2\t3\t5\r\n5\t4\t3\t1\t2\t6\r\n6\t5\t2\t3\r\n7\t3\r\n";

describe('#AdjacencyList', function(){
    let list = new AdjacencyList(kargerMinCutGraphString);
    it('should exist', function(){
        expect(list).to.not.be.undefined;
    });

    it('should have the right number of vertexes',function(){
        let vertexes = list.count_vertexes();
        expect(vertexes).to.equal(200);
    });

    let small_graph = new AdjacencyList(small_graph_string.split('\r\n'));

    it('should correctly initialize the degree of our vertexes', function(){
        expect(small_graph.vertex_degrees).to.eql([,3,4,4,4,5,3,1]);
    })

    it('should have at least the minimum number of edges in a connected graph', function(){
        let edges = list.count_edges();
        let vertexes = list.count_vertexes();
        expect(edges).to.be.greaterThan(vertexes-2);
    });

    describe('#random_edge', function(){
        it('should return an edge uniformly at random',function(){
            let frequencies = new Array(8).fill(0);
            let trials = 100000;
            for(let i = 0; i < trials; i++){
                let edge = small_graph.random_edge();
                frequencies[edge[2]] += 1;
            }
            //14% error bound for randomly choosing edges.
            let error = 0.07;

            /* Okay we need 5 to show up at about 5/24 probability, 2: 4/24, 7: 1/24 */
            expect(frequencies["7"]).to.be.greaterThan(trials*1/24*(1-error));
            expect(frequencies["7"]).to.be.lessThan(trials*1/24*(1+error));

            expect(frequencies["5"]).to.be.greaterThan(trials*5/24*(1-error));
            expect(frequencies["5"]).to.be.lessThan(trials*5/24*(1+error));
            
            expect(frequencies["4"]).to.be.greaterThan(trials*4/24*(1-error));
            expect(frequencies["4"]).to.be.lessThan(trials*4/24*(1+error));
        })
    });

    describe('#collapseVertex()', function(){
        it('should delete self loops', function(){
            expect(false).to.be.true;
        });
    });
});

describe('#Mincutter', function(){
    let minc = new MinCutter(kargerMinCutGraphString);
    it('should return the number of vertexes before cutting',function(){
        expect(minc.size_of_input()).to.equal(200);
    })
    const four_node = fs.readFileSync('four_nodes_test.txt', 'utf8').split('\r\n');
    let minc_four = new MinCutter(four_node);
    it('should find the right number of cuts in a four node graph', function(){
        const cut = minc_four.find_mincut();
        console.log(cut);
        expect(cut).to.equal(2);
    })


    it('should find the min cut on a smaller file', function(){
        let small_minc = new MinCutter(small_graph_string.split('\r\n'));
        expect(small_minc.find_mincut()).to.equal(1);
    });

   it('should find a mincut for the large string', function(){
        let cut = minc.find_mincut();
        expect(cut).to.eql(17);
    });
});
