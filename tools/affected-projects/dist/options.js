"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.STDOUT_FORMAT = void 0;
var STDOUT_FORMAT;
(function (STDOUT_FORMAT) {
    STDOUT_FORMAT[STDOUT_FORMAT["JSON"] = 0] = "JSON";
    STDOUT_FORMAT[STDOUT_FORMAT["RAW"] = 1] = "RAW";
})(STDOUT_FORMAT = exports.STDOUT_FORMAT || (exports.STDOUT_FORMAT = {}));
var args = new Set(process.argv.slice(2));
var outFormat = STDOUT_FORMAT.RAW;
if (args.has('--json')) {
    outFormat = STDOUT_FORMAT.JSON;
}
exports.options = {
    help: args.has('--help'),
    outFormat: outFormat,
    dependents: args.has('--dependents'),
    sameBranch: args.has('--same-branch'),
};
//# sourceMappingURL=options.js.map