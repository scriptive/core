!function(n) {
    n.load = function(n) {
        console.log("load 1");
        var o = this.what();
        o.then(function(n) {
            console.log("what", n);
        });
    }, n.what = function() {
        return new Promise(function(n, o) {
            o("Error");
        }).then(function(n) {
            return console.log("if success", n), n;
        }, function(n) {
            return console.log("if fail", n), n;
        }).then(function(n) {
            return console.log("when done", n), n;
        });
    };
}(scriptive("app"));