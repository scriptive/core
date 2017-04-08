!function(e) {
    e.merge({
        config: {
            name: "scriptive",
            description: "Javascript application service",
            developer: "Khen Solomon Lethil",
            version: "1.0.3",
            build: "1.2.2",
            id: "scriptive",
            idUnique: "core:unique",
            file: {
                template: "z.html"
            },
            fileStorage: {
                RequestQuota: 1073741824,
                Permission: 1,
                objectStore: {
                    name: "core",
                    version: 1
                }
            },
            todo: {},
            page: {
                home: {
                    class: "icon-language"
                },
                lookup: {
                    class: "icon-search"
                },
                setting: {
                    class: "icon-setting"
                },
                about: {
                    class: "icon-info"
                }
            }
        },
        initiate: function() {
            var n = e.config, t = e.localStorage, i = function() {
                return new Promise(function(t, i) {
                    e.fileStorage = fileStorage(n.fileStorage, {
                        success: function() {
                            t();
                        },
                        fail: function(e) {
                            i(e);
                        }
                    });
                }).then(function() {
                    return !0;
                }, function(e) {
                    return e;
                });
            }, o = function() {
                var e = t.name, i = {
                    page: "home",
                    q: "",
                    result: ""
                }, o = {
                    page: function(t, i, o) {
                        e.query[t] = n.page.hasOwnProperty(i.toLowerCase()) ? i.toLowerCase() : o;
                    },
                    q: function(n, t, i) {
                        e.query[n] = decodeURIComponent(t);
                    }
                };
                return new Promise(function(t, r) {
                    try {
                        e.query.isEmpty() ? e.query.merge(i, n.hash) : e.query.merge(n.hash), e.query.each(function(e, n, t, r) {
                            o.isFunction(e) && o[e](e, n, i[e]);
                        }), t();
                    } catch (e) {
                        r(e);
                    }
                }).then(function() {
                    return t.update("query"), !0;
                }, function(e) {
                    return e;
                });
            }, r = function() {
                return e.fileStorage.download({
                    url: n.file.template.replace(/z/, n.DeviceTemplate.join(".")),
                    before: function(e) {
                        e.overrideMimeType("text/html; charset=utf-8"), e.responseType = "document";
                    }
                }).then(function(e) {
                    try {
                        for (var n = e.data.body; n.firstChild; ) document.body.appendChild(n.firstChild);
                        return u().then(function(e) {
                            return !0 === e && document.querySelector("div#screen").remove(), e;
                        });
                    } catch (e) {
                        return e;
                    }
                }, function(e) {
                    return e;
                });
            }, u = function() {
                return o().then(function(n) {
                    return !0 === n ? new Promise(function(n, i) {
                        e.page[t.name.query.page](n, i);
                    }).then(function() {
                        return e.Toggle.header().then(function(n) {
                            try {
                                e.dataContent();
                            } catch (n) {
                                return n;
                            }
                            return !0;
                        });
                    }, function(e) {
                        return e;
                    }) : n;
                });
            };
            new Promise(function(e, o) {
                t.select("setting").select("query").select("todo"), t.name.setting.hasOwnProperty("build") ? t.name.setting.build == n.build ? n.requireUpdate = 0 : n.requireUpdate = 2 : n.requireUpdate = 1, 
                n.requireUpdate && (t.name.setting.version = n.version, t.name.setting.build = n.build, 
                t.update("setting")), i().then(function(e) {
                    return !0 === e ? r() : e;
                }).then(function(n) {
                    !0 === n ? e() : o(n);
                });
            }).then(function() {
                e.hashChange(function() {
                    u().then(function(e) {
                        !0 !== e && console.log("page error", e);
                    });
                });
            }, function(n) {
                "object" == typeof n && n.hasOwnProperty("message") ? e.notification(n.message) : "string" == typeof n && e.notification(n);
            });
        },
        dialog: {
            container: function() {
                return e.elementSelect("div#dialog");
            }
        },
        nav: {
            container: function() {
                return e.elementSelect("nav");
            }
        },
        header: {
            container: function() {
                return e.elementSelect("header");
            }
        },
        main: {
            container: function() {
                return e.elementSelect("main");
            }
        },
        footer: {
            container: function() {
                return e.elementSelect("footer");
            }
        },
        page: {
            home: function(e, n) {
                n("device Ready");
            },
            lookup: function(e, n) {
                n("page fail");
            },
            setting: function(e, n) {
                n("page fail");
            },
            about: function(e, n) {
                n("page fail");
            }
        }
    });
}(scriptive("app"));