var app, isUpgraded = "upgraded";

chrome.runtime.onInstalled.addListener(function(e) {
    var i = chrome.runtime.getManifest();
    e.previousVersion && e.previousVersion != i.version && chrome.notifications.create(isUpgraded, {
        type: "basic",
        iconUrl: "img/icon.128.png",
        title: i.name + " has been upgraded",
        message: "Version " + i.version + ". Thoughts and opinions are most welcome via Chrome Web Store!",
        isClickable: !0
    });
}), chrome.notifications.onClicked.addListener(function(e) {
    "upgraded" == e && window.open("https://chrome.google.com/webstore/detail/lai-siangtho/ahbpjkapcngbdcenpkflgmbpeigjlbpc", "target=_blank");
}), chrome.runtime.onSuspend.addListener(function() {}), chrome.runtime.onUpdateAvailable.addListener(function() {}), 
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("index.html", {
        frame: "none",
        id: "laisiangtho",
        innerBounds: {
            width: 700,
            height: 500,
            left: 600,
            minWidth: 330,
            minHeight: 400
        }
    }, function(e) {
        app = e.contentWindow;
        var i = {
            data: {
                "jquery.min": {
                    type: "script",
                    dir: "lib/"
                },
                "jquery.ui.min": {
                    type: "script",
                    dir: "lib/"
                },
                "jquery.ui.touch-punch.min": {
                    type: "script",
                    dir: "lib/"
                },
                "chrome.google-analytics-bundle": {
                    type: "script",
                    dir: "lib/"
                },
                "localforage.min": {
                    type: "script",
                    dir: "lib/"
                },
                script: {
                    type: "script"
                }
            },
            script: {
                attr: {
                    src: ""
                },
                extension: ".js",
                dir: "js/"
            },
            link: {
                attr: {
                    rel: "stylesheet",
                    type: "text/css",
                    href: ""
                },
                extension: ".css",
                dir: "css/"
            },
            init: function() {
                this.load(Object.keys(this.data));
            },
            load: function(e) {
                var i = e.shift(), t = this.data[i].type, n = this, a = (this.data[i].dir ? this.data[i].dir : this[t].dir) + i + this[t].extension, o = app.document.createElement(t);
                for (var r in this[t].attr) o[r] = this[t].attr[r] ? this[t].attr[r] : a;
                o.onload = function() {
                    e.length ? n.load(e) : n.done();
                }, app.document.head.appendChild(o);
            },
            done: function() {
                app.localStorage = chrome.storage.local, app.screenStatus = e;
            },
            ready: function() {
                app.jQuery(app.document.body).laisiangtho({
                    L: {
                        script: [ "data bible", "data config" ]
                    },
                    E: [ {
                        metalink: [ "api" ]
                    }, "load", "watch" ],
                    Device: "chrome",
                    Platform: "app",
                    App: "laisiangtho",
                    Click: "click",
                    On: "fO"
                }).Ready();
            }
        };
        app.addEventListener("DOMContentLoaded", function(e) {
            i.init(e);
        }), app.addEventListener("load", function(e) {
            i.ready(e);
        }, !1);
    });
});