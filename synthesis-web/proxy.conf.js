const srv="http://192.168.1.83:8010/";
const srv1="https://sinteze.intelektika.lt/";

const PROXY_CONFIG = {
  "/synthesis.service/": {
    "target": srv1,
    "secure": false,
    // "pathRewrite": {"^/synthesis.service/astra": ""},
    "logLevel": "debug"
  },
  "/synthesis.data/": {
    "target": srv1,
    "secure": false,
    //"pathRewrite": {"^/synthesis.service": ""},
    "logLevel": "debug"
  },
  "/synthesis.sayings/": {
    "target": srv1,
    "secure": false,
    //"pathRewrite": {"^/synthesis.sayings": ""}
    "logLevel": "debug"
  }
}

module.exports = PROXY_CONFIG;
