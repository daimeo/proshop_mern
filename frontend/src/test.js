// IIFE
(function b() {
    var foo = "hello";
    console.log(foo);
})();
console.log();

// Non IIFE
function a() {
    var bar = "world";
    console.log(bar);
}

a();
