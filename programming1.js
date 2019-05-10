var fs = require('fs');

var merge_count = function(arr, size){
    if (size == 1) return [0,arr];

    var front = arr.slice(0,size/2);
    var back = arr.slice(size/2, size);

    var [left_invs,front] = merge_count(front,front.length);
    var [right_invs,back] = merge_count(back,back.length);

    var splits = 0;
    var sorted = [];
    for(var front_i = 0, back_i = 0, sorted_i = 0; front_i < front.length || back_i < back.length;){
        if(front[front_i] <= back[back_i] || back[back_i] == undefined){
            sorted[sorted_i] = front[front_i];
            front_i++;
            sorted_i++;
        } else {
            sorted[sorted_i] = back[back_i];
            back_i++;
            sorted_i++;
            splits += (front.length - front_i);
        }
    }
    return [left_invs+right_invs+splits, sorted];
};

var contents = fs.readFileSync('IntegerArray.txt', 'utf8').split('\r\n').map(x => parseInt(x));
//var contents = fs.readFileSync('testArray.txt', 'utf8').split('\r\n').map(x => parseInt(x));

var contents = contents.filter(function (value) {
    return !Number.isNaN(value);
});

var [count , sorted] = merge_count(contents,contents.length);

console.log("The number of inversions is: " + count);