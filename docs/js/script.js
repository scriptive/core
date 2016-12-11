!function(n) {
    n.load = function(n) {
        console.log("loaded");
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