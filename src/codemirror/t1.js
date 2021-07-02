t1 = {}
t1.f1 = function(s){
    console.log("f1: " + s);
}
t1.f2 = function(s){
    console.log("f2: " + s);
}
var func = t1["f1"]
func("s1")