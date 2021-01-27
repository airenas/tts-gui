const PROXY_CONFIG = {
  "/synthesis.service/": {
    //"target": "http://localhost:7050/",
    "target": "https://sinteze.intelektika.lt/",
    "secure": false,
    // "pathRewrite": {"^/synthesis.service": ""},
    "logLevel": "debug"
  },
  "/synthesis.data/": {
    //"target": "http://localhost:7050/",
    "target": "https://sinteze.intelektika.lt/",
    "secure": false,
    //"pathRewrite": {"^/synthesis.service": ""},
    "logLevel": "debug"
  },
  "/synthesis.sayings/": {
    "target": "https://sinteze.intelektika.lt/",
    "secure": false,
    //"pathRewrite": {"^/synthesis.sayings": ""}
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
