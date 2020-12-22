const PROXY_CONFIG = {
  "/synthesis.service/dnn-sabina-01": {
    //"target": "http://localhost:7050/",
    "target": "http://list.airenas.eu:6080/",
    "secure": false,
    // "pathRewrite": {"^/synthesis.service": ""},
    "logLevel": "debug"
  },
  "/synthesis.service/": {
    //"target": "http://localhost:7050/",
    "target": "http://localhost:8201/",
    "secure": false,
    "pathRewrite": {"^/synthesis.service": ""},
    "logLevel": "debug"
  },
  "/synthesis.sayings/": {
    "target": "http://localhost:7050/",
    "secure": false,
    //"pathRewrite": {"^/synthesis.sayings": ""}
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
