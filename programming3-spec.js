const expect = require('chai').expect;
const fs = require('fs');



const programming3 = require('./programming3.js');
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
        let vertex = programming3.Vertex;
        expect(vertex).to.not.be.undefined;
    })
})

const contents = fs.readFileSync('kargerMinCut.txt', 'utf8').split('\r\n');

describe('#AdjacencyList', function(){
    let list = new AdjacencyList(contents);
    it('should exist', function(){
        expect(list).to.not.be.undefined;
    });

    it('should have the right number of vertexes',function(){
        let vertexes = list.count_vertexes();
        expect(vertexes).to.equal(200);
    })

    it('should have at least the minimum number of edges in a connected graph', function(){
        let edges = list.count_edges();
        let vertexes = list.count_vertexes();
        expect(edges).to.be.greaterThan(vertexes-2);
    })
})

describe('#Mincutter', function(){
    let minc = new MinCutter(contents);
    it('should return the number of vertexes before cutting',function(){
        expect(minc.has_cut).to.equal(false);
        expect(minc.size_of_input()).to.equal(200);
    })

    it('should find the min cut on a smaller file', function(){
        let test_string = "1\t2\t5\t4\r\n2\t5\t6\t1\t4\r\n3\t6\t5\t4\t7\r\n4\t1\t2\t3\t5\r\n5\t4\t3\t1\t2\t6\r\n6\t5\t2\t3\r\n7\t3\r\n";
        let small_minc = new MinCutter(test_string.split('\r\n'));
        expect(small_minc.find_mincut()).to.equal(2);
    })
})
