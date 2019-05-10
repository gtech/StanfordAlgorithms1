// var rand = import('random');
var fs = require('fs');

class Sorter{

    constructor(array){
        this.array = array;
        this.comparisons = 0;
        this.inversions = 0;
    }

    swap(a,b){
        var temp = this.array[a];
        this.array[a] = this.array[b];
        this.array[b] = temp;
    }

    sort(){
        if (this.array.length <= 1) return;
        this.quicksort(0, this.array.length- 1);
    }

    quicksort(start,end){
        
        if (start >= end) return;
        
        var pivot = this.partition(start,end)

        this.quicksort(start,pivot - 1)
        this.quicksort(pivot + 1, end)
    }

    sort_end(start,end){
        this.swap(start,end);
        this.quicksort(start,end);
    }
    partition(start, end){
        this.comparisons += (end - start);

        var pivot = this.choose_pivot(start,end);
        this.swap(pivot,start);

        pivot = start;
        for(var i = start+1; i < end + 1; i++){
            if (this.array[i] < this.array[start]){
                pivot += 1;
                this.swap(i,pivot);
            }
        }
        this.swap(start,pivot);
        return pivot;
    }

    random_pivot(start,end){
        return Math.floor(Math.random() * (end-start)) + start;
    }

    choose_pivot(start,end){
        return this.random_pivot(start,end);
    }
}

class FirstElementQuicksort extends Sorter{
    choose_pivot(start,end){
        return start;
    }
}

class LastElementQuicksort extends Sorter{
    choose_pivot(start,end){
        return end;
    }
}

/* 
class QuickSorterLastElementPivot(QuickSorter){
    partition(start, end){
        this._array[start], this._array[end] = this._array[end], this._array[start]
        return super(QuickSorterLastElementPivot, this).partition(start, end)
    }
        
} */
    

var contents = fs.readFileSync('QuickSort.txt', 'utf8').split('\r\n').map(x => parseInt(x));

var contents = contents.filter(function (value) {
    return !Number.isNaN(value);
});

//contents = [2,3,5,0,83,8,7,6,9]
//count = 0;
var b = new Sorter(contents);
b.sort();
console.log(b.comparisons);
//console.log(b.array);
//var c = 0;

/* |        a   |             |

1 - a - 0.5
1 - 2a   */

/* Compare left vs right
then compare up vs down
then compare lr vs ud */

/* so a perfect split every time is log(n)
a lower bound will be if we get closer to 0.5
a higher bound will be if we get further from 0.5(random)
being greater than alpha will always be better
*/

/* if (length <= 1) return this.array;
    
var less = unpart = temp = 1;
var pivot = this.array[0];

while(unpart < length){
    if(pivot > this.array[unpart]){
        swap(less,unpart,this.array);
        unpart ++;
        less ++;
    } else{
        unpart++;
    }
}
swap(less-1,0,this.array);
var half_1 = this.array.slice(0,less-1);
var half_2 = this.array.slice(less);
count += half_1.length - 1 + half_2.length - 1 ;

return quicksort(half_1).concat([pivot]).concat(quicksort(half_2)); */