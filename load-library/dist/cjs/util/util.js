"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var util_exports = {};
__export(util_exports, {
  handleSummary: () => handleSummary
});
module.exports = __toCommonJS(util_exports);
var import_k6_summary = require("../k6-libs/k6-summary");
function handleSummary(data) {
  var _a;
  const summary = {};
  let showColors = true;
  if (__ENV.UPLOAD_RESULTS === "true") {
    showColors = false;
    const outdir = (_a = __ENV.OUT_DIR) != null ? _a : ".";
    summary[`${outdir}/junit.xml`] = (0, import_k6_summary.jUnit)(data, null);
    summary[`${outdir}/summary.csv`] = (0, import_k6_summary.csvSummary)(data, null);
    summary[`${outdir}/summary.txt`] = (0, import_k6_summary.textSummary)(data, { indent: " ", enableColors: false });
  } else {
    summary.stdout = (0, import_k6_summary.textSummary)(data, { indent: " ", enableColors: showColors });
  }
  return summary;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleSummary
});
//# sourceMappingURL=util.js.map
