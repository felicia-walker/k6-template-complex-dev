var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/k6-libs/k6-summary.js
var require_k6_summary = __commonJS({
  "src/k6-libs/k6-summary.js"(exports, module) {
    "use strict";
    var forEach = function(obj, callback) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (callback(key, obj[key])) {
            break;
          }
        }
      }
    };
    var palette = {
      bold: 1,
      faint: 2,
      red: 31,
      green: 32,
      cyan: 36
      //TODO: add others?
    };
    var groupPrefix = "\xE2\u2013\u02C6";
    var detailsPrefix = "\xE2\u2020\xB3";
    var succMark = "\xE2\u0153\u201C";
    var failMark = "\xE2\u0153\u2014";
    var defaultOptions = {
      indent: " ",
      enableColors: true,
      summaryTimeUnit: null,
      summaryTrendStats: null
    };
    function strWidth(s) {
      var data2 = s.normalize("NFKC");
      var inEscSeq = false;
      var inLongEscSeq = false;
      var width = 0;
      for (var char of data2) {
        if (char.done) {
          break;
        }
        if (char == "\x1B") {
          inEscSeq = true;
          continue;
        }
        if (inEscSeq && char == "[") {
          inLongEscSeq = true;
          continue;
        }
        if (inEscSeq && inLongEscSeq && char.charCodeAt(0) >= 64 && char.charCodeAt(0) <= 126) {
          inEscSeq = false;
          inLongEscSeq = false;
          continue;
        }
        if (inEscSeq && !inLongEscSeq && char.charCodeAt(0) >= 64 && char.charCodeAt(0) <= 95) {
          inEscSeq = false;
          continue;
        }
        if (!inEscSeq && !inLongEscSeq) {
          width++;
        }
      }
      return width;
    }
    function summarizeCheck(indent, check2, decorate) {
      if (check2.fails == 0) {
        return decorate(indent + succMark + " " + check2.name, palette.green);
      }
      var succPercent = Math.floor(100 * check2.passes / (check2.passes + check2.fails));
      return decorate(
        indent + failMark + " " + check2.name + "\n" + indent + " " + detailsPrefix + "  " + succPercent + "% \xE2\u20AC\u201D " + succMark + " " + check2.passes + " / " + failMark + " " + check2.fails,
        palette.red
      );
    }
    function summarizeGroup(indent, group, decorate) {
      var result2 = [];
      if (group.name != "") {
        result2.push(indent + groupPrefix + " " + group.name + "\n");
        indent = indent + "  ";
      }
      for (var i2 = 0; i2 < group.checks.length; i2++) {
        result2.push(summarizeCheck(indent, group.checks[i2], decorate));
      }
      if (group.checks.length > 0) {
        result2.push("");
      }
      for (var i2 = 0; i2 < group.groups.length; i2++) {
        Array.prototype.push.apply(result2, summarizeGroup(indent, group.groups[i2], decorate));
      }
      return result2;
    }
    function displayNameForMetric(name2) {
      var subMetricPos = name2.indexOf("{");
      if (subMetricPos >= 0) {
        return "{ " + name2.substring(subMetricPos + 1, name2.length - 1) + " }";
      }
      return name2;
    }
    function indentForMetric(name2) {
      if (name2.indexOf("{") >= 0) {
        return "  ";
      }
      return "";
    }
    function humanizeBytes(bytes) {
      var units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var base = 1e3;
      if (bytes < 10) {
        return bytes + " B";
      }
      var e = Math.floor(Math.log(bytes) / Math.log(base));
      var suffix = units[e | 0];
      var val = Math.floor(bytes / Math.pow(base, e) * 10 + 0.5) / 10;
      return val.toFixed(val < 10 ? 1 : 0) + " " + suffix;
    }
    var unitMap = {
      s: { unit: "s", coef: 1e-3 },
      ms: { unit: "ms", coef: 1 },
      us: { unit: "\xC2\xB5s", coef: 1e3 }
    };
    function toFixedNoTrailingZeros(val, prec) {
      return parseFloat(val.toFixed(prec)).toString();
    }
    function toFixedNoTrailingZerosTrunc(val, prec) {
      var mult = Math.pow(10, prec);
      return toFixedNoTrailingZeros(Math.trunc(mult * val) / mult, prec);
    }
    function humanizeGenericDuration(dur) {
      if (dur === 0) {
        return "0s";
      }
      if (dur < 1e-3) {
        return Math.trunc(dur * 1e6) + "ns";
      }
      if (dur < 1) {
        return toFixedNoTrailingZerosTrunc(dur * 1e3, 2) + "\xC2\xB5s";
      }
      if (dur < 1e3) {
        return toFixedNoTrailingZerosTrunc(dur, 2) + "ms";
      }
      var result2 = toFixedNoTrailingZerosTrunc(dur % 6e4 / 1e3, dur > 6e4 ? 0 : 2) + "s";
      var rem = Math.trunc(dur / 6e4);
      if (rem < 1) {
        return result2;
      }
      result2 = rem % 60 + "m" + result2;
      rem = Math.trunc(rem / 60);
      if (rem < 1) {
        return result2;
      }
      return rem + "h" + result2;
    }
    function humanizeDuration(dur, timeUnit) {
      if (timeUnit !== "" && unitMap.hasOwnProperty(timeUnit)) {
        return (dur * unitMap[timeUnit].coef).toFixed(2) + unitMap[timeUnit].unit;
      }
      return humanizeGenericDuration(dur);
    }
    function humanizeValue(val, metric, timeUnit) {
      if (metric.type == "rate") {
        return (Math.trunc(val * 100 * 100) / 100).toFixed(2) + "%";
      }
      switch (metric.contains) {
        case "data":
          return humanizeBytes(val);
        case "time":
          return humanizeDuration(val, timeUnit);
        default:
          return toFixedNoTrailingZeros(val, 6);
      }
    }
    function nonTrendMetricValueForSum(metric, timeUnit) {
      switch (metric.type) {
        case "counter":
          return [
            humanizeValue(metric.values.count, metric, timeUnit),
            humanizeValue(metric.values.rate, metric, timeUnit) + "/s"
          ];
        case "gauge":
          return [
            humanizeValue(metric.values.value, metric, timeUnit),
            "min=" + humanizeValue(metric.values.min, metric, timeUnit),
            "max=" + humanizeValue(metric.values.max, metric, timeUnit)
          ];
        case "rate":
          return [
            humanizeValue(metric.values.rate, metric, timeUnit),
            succMark + " " + metric.values.passes,
            failMark + " " + metric.values.fails
          ];
        default:
          return ["[no data]"];
      }
    }
    function summarizeMetrics(options2, data2, decorate) {
      var indent = options2.indent + "  ";
      var result2 = [];
      var names2 = [];
      var nameLenMax = 0;
      var nonTrendValues = {};
      var nonTrendValueMaxLen = 0;
      var nonTrendExtras = {};
      var nonTrendExtraMaxLens = [0, 0];
      var trendCols2 = {};
      var numTrendColumns2 = options2.summaryTrendStats.length;
      var trendColMaxLens2 = new Array(numTrendColumns2).fill(0);
      forEach(data2.metrics, function(name3, metric2) {
        names2.push(name3);
        var displayName = indentForMetric(name3) + displayNameForMetric(name3);
        var displayNameWidth = strWidth(displayName);
        if (displayNameWidth > nameLenMax) {
          nameLenMax = displayNameWidth;
        }
        if (metric2.type == "trend") {
          var cols2 = [];
          for (var i2 = 0; i2 < numTrendColumns2; i2++) {
            var tc = options2.summaryTrendStats[i2];
            var value2 = metric2.values[tc];
            if (tc === "count") {
              value2 = value2.toString();
            } else {
              value2 = humanizeValue(value2, metric2, options2.summaryTimeUnit);
            }
            var valLen = strWidth(value2);
            if (valLen > trendColMaxLens2[i2]) {
              trendColMaxLens2[i2] = valLen;
            }
            cols2[i2] = value2;
          }
          trendCols2[name3] = cols2;
          return;
        }
        var values = nonTrendMetricValueForSum(metric2, options2.summaryTimeUnit);
        nonTrendValues[name3] = values[0];
        var valueLen = strWidth(values[0]);
        if (valueLen > nonTrendValueMaxLen) {
          nonTrendValueMaxLen = valueLen;
        }
        nonTrendExtras[name3] = values.slice(1);
        for (var i2 = 1; i2 < values.length; i2++) {
          var extraLen = strWidth(values[i2]);
          if (extraLen > nonTrendExtraMaxLens[i2 - 1]) {
            nonTrendExtraMaxLens[i2 - 1] = extraLen;
          }
        }
      });
      names2.sort(function(metric1, metric2) {
        var parent1 = metric1.split("{", 1)[0];
        var parent2 = metric2.split("{", 1)[0];
        var result3 = parent1.localeCompare(parent2);
        if (result3 !== 0) {
          return result3;
        }
        var sub1 = metric1.substring(parent1.length);
        var sub2 = metric2.substring(parent2.length);
        return sub1.localeCompare(sub2);
      });
      var getData2 = function(name3) {
        if (trendCols2.hasOwnProperty(name3)) {
          var cols2 = trendCols2[name3];
          var tmpCols2 = new Array(numTrendColumns2);
          for (var i2 = 0; i2 < cols2.length; i2++) {
            tmpCols2[i2] = options2.summaryTrendStats[i2] + "=" + decorate(cols2[i2], palette.cyan) + " ".repeat(trendColMaxLens2[i2] - strWidth(cols2[i2]));
          }
          return tmpCols2.join(" ");
        }
        var value2 = nonTrendValues[name3];
        var fmtData = decorate(value2, palette.cyan) + " ".repeat(nonTrendValueMaxLen - strWidth(value2));
        var extras = nonTrendExtras[name3];
        if (extras.length == 1) {
          fmtData = fmtData + " " + decorate(extras[0], palette.cyan, palette.faint);
        } else if (extras.length > 1) {
          var parts = new Array(extras.length);
          for (var i2 = 0; i2 < extras.length; i2++) {
            parts[i2] = decorate(extras[i2], palette.cyan, palette.faint) + " ".repeat(nonTrendExtraMaxLens[i2] - strWidth(extras[i2]));
          }
          fmtData = fmtData + " " + parts.join(" ");
        }
        return fmtData;
      };
      for (var name2 of names2) {
        var metric = data2.metrics[name2];
        var mark = " ";
        var markColor = function(text) {
          return text;
        };
        if (metric.thresholds) {
          mark = succMark;
          markColor = function(text) {
            return decorate(text, palette.green);
          };
          forEach(metric.thresholds, function(name3, threshold) {
            if (!threshold.ok) {
              mark = failMark;
              markColor = function(text) {
                return decorate(text, palette.red);
              };
              return true;
            }
          });
        }
        var fmtIndent = indentForMetric(name2);
        var fmtName2 = displayNameForMetric(name2);
        fmtName2 = fmtName2 + decorate(".".repeat(nameLenMax - strWidth(fmtName2) - strWidth(fmtIndent) + 3) + ":", palette.faint);
        result2.push(indent + fmtIndent + markColor(mark) + " " + fmtName2 + " " + getData2(name2));
      }
      return result2;
    }
    function summarizeMetricsCsv(options, data) {
      var result = [];
      var names = [];
      var trendCols = {};
      var numTrendColumns = options.summaryTrendStats.length;
      var trendColMaxLens = new Array(numTrendColumns).fill(0);
      forEach(data.metrics, function(name2, metric) {
        names.push(name2);
        if (metric.type == "trend") {
          var cols2 = [];
          for (var i2 = 0; i2 < numTrendColumns; i2++) {
            var tc = options.summaryTrendStats[i2];
            var value2 = metric.values[tc];
            if (tc === "count") {
              value2 = value2.toString();
            } else {
              value2 = humanizeValue(value2, metric, options.summaryTimeUnit);
            }
            var valLen = strWidth(value2);
            if (valLen > trendColMaxLens[i2]) {
              trendColMaxLens[i2] = valLen;
            }
            cols2[i2] = value2;
          }
          trendCols[name2] = cols2;
          return;
        }
      });
      names.sort(function(metric1, metric2) {
        var parent1 = metric1.split("{", 1)[0];
        var parent2 = metric2.split("{", 1)[0];
        var result2 = parent1.localeCompare(parent2);
        if (result2 !== 0) {
          return result2;
        }
        var sub1 = metric1.substring(parent1.length);
        var sub2 = metric2.substring(parent2.length);
        return sub1.localeCompare(sub2);
      });
      var getData = function(name) {
        if (trendCols.hasOwnProperty(name)) {
          var cols = trendCols[name];
          var tmpHeaderCols = new Array(numTrendColumns);
          for (var i = 0; i < cols.length; i++) {
            tmpHeaderCols[i] = options.summaryTrendStats[i];
          }
          var cols = trendCols[name];
          var tmpCols = new Array(numTrendColumns);
          for (var i = 0; i < cols.length; i++) {
            var value = cols[i].replace("ms", "");
            value = value.replace("\xC2\xB5s", " / 1000");
            value = value.replace("s", " * 1000");
            value = value.replace("m", " * 60 * 1000 + ");
            try {
              tmpCols[i] = eval(value);
            } catch (err) {
              tmpCols[i] = value;
            }
          }
          return [tmpHeaderCols, tmpCols.join(",")];
        }
        return ["", ""];
      };
      var headerFound = false;
      for (var name of names) {
        var fmtName = displayNameForMetric(name);
        var data = getData(name);
        if (!headerFound && data[0].length > 0) {
          headerFound = true;
          result.push("names," + data[0]);
        }
        if (data[1].length > 0) {
          result.push(fmtName + "," + data[1]);
        }
      }
      return result;
    }
    function generateTextSummary(data2, options2) {
      var mergedOpts = Object.assign({}, defaultOptions, data2.options, options2);
      var lines = [];
      var decorate = function(text) {
        return text;
      };
      if (mergedOpts.enableColors) {
        decorate = function(text, color) {
          var result2 = "\x1B[" + color;
          for (var i2 = 2; i2 < arguments.length; i2++) {
            result2 += ";" + arguments[i2];
          }
          return result2 + "m" + text + "\x1B[0m";
        };
      }
      Array.prototype.push.apply(lines, summarizeGroup(mergedOpts.indent + "    ", data2.root_group, decorate));
      Array.prototype.push.apply(lines, summarizeMetrics(mergedOpts, data2, decorate));
      return lines.join("\n");
    }
    function generateCsvSummary(data2, options2) {
      var mergedOpts = Object.assign({}, defaultOptions, data2.options, options2);
      var lines = [];
      Array.prototype.push.apply(lines, summarizeMetricsCsv(mergedOpts, data2));
      return lines.join("\n");
    }
    exports.humanizeValue = humanizeValue;
    exports.textSummary = generateTextSummary;
    exports.csvSummary = generateCsvSummary;
    var replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, function(char) {
        return replacements[char];
      });
    }
    function generateJUnitXML(data2, options2) {
      var failures = 0;
      var cases = [];
      forEach(data2.metrics, function(metricName, metric) {
        if (!metric.thresholds) {
          return;
        }
        forEach(metric.thresholds, function(thresholdName, threshold) {
          if (threshold.ok) {
            cases.push('<testcase name="' + escapeHTML(metricName) + " - " + escapeHTML(thresholdName) + '" />');
          } else {
            failures++;
            cases.push(
              '<testcase name="' + escapeHTML(metricName) + " - " + escapeHTML(thresholdName) + '"><failure message="failed" /></testcase>'
            );
          }
        });
      });
      var name2 = options2 && options2.name ? escapeHTML(options2.name) : "k6 thresholds";
      return '<?xml version="1.0"?>\n<testsuites tests="' + cases.length + '" failures="' + failures + '">\n<testsuite name="' + name2 + '" tests="' + cases.length + '" failures="' + failures + '">' + cases.join("\n") + "\n</testsuite >\n</testsuites >";
    }
    exports.jUnit = generateJUnitXML;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SampleService: () => SampleService,
  handleSummary: () => handleSummary
});

// src/util/util.ts
var import_k6_summary = __toESM(require_k6_summary());
function handleSummary(data2) {
  var _a;
  const summary = {};
  let showColors = true;
  if (__ENV.UPLOAD_RESULTS === "true") {
    showColors = false;
    const outdir = (_a = __ENV.OUT_DIR) != null ? _a : ".";
    summary[`${outdir}/junit.xml`] = (0, import_k6_summary.jUnit)(data2, null);
    summary[`${outdir}/summary.csv`] = (0, import_k6_summary.csvSummary)(data2, null);
    summary[`${outdir}/summary.txt`] = (0, import_k6_summary.textSummary)(data2, { indent: " ", enableColors: false });
  } else {
    summary.stdout = (0, import_k6_summary.textSummary)(data2, { indent: " ", enableColors: showColors });
  }
  return summary;
}

// src/index.ts
__reExport(src_exports, __toESM(require_k6_summary()));

// src/services/sample.service.ts
import http from "k6/http";
import { check, sleep } from "k6";
var SampleService = class {
  constructor(delay = 1) {
    this.delay = 1;
    this.delay = delay;
  }
  loadK6Page(...trends) {
    const res = http.get("https://test.k6.io");
    sleep(this.delay);
    trends.forEach((trend) => {
      trend.add(res.timings.waiting);
    });
    check(res, {
      "K6 page request accepted": (r) => r.status === 200,
      "K6 page content returned": (r) => r.body != null && r.body.length > 0
    });
    return res;
  }
};
export {
  SampleService,
  handleSummary
};
//# sourceMappingURL=index.mjs.map
