"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sample_service_exports = {};
__export(sample_service_exports, {
  default: () => SampleService
});
module.exports = __toCommonJS(sample_service_exports);
var import_http = __toESM(require("k6/http"));
var import_k6 = require("k6");
class SampleService {
  constructor(delay = 1) {
    this.delay = 1;
    this.delay = delay;
  }
  loadK6Page(...trends) {
    const res = import_http.default.get("https://test.k6.io");
    (0, import_k6.sleep)(this.delay);
    trends.forEach((trend) => {
      trend.add(res.timings.waiting);
    });
    (0, import_k6.check)(res, {
      "K6 page request accepted": (r) => r.status === 200,
      "K6 page content returned": (r) => r.body != null && r.body.length > 0
    });
    return res;
  }
}
