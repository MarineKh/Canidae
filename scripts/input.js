var i = 0;
function increment() {
    (i < 5) ? ++i : i = 0; 
    $("#result").val(i);
}
function decrement() {
    (i > 0) ? --i : i = 5; 
    $("#result").val(i);
}