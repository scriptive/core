!function(o) {
    o.load = function(n) {
        console.log("loaded"), o.localStorage.select("isObjs"), console.log(o.localStorage.name.isObjs);
    }, o.what = function() {
        return new Promise(function(o, n) {
            n("Error");
        }).then(function(o) {
            return console.log("if success", o), o;
        }, function(o) {
            return console.log("if fail", o), o;
        }).then(function(o) {
            return console.log("when done", o), o;
        });
    };
}(scriptive("app"));