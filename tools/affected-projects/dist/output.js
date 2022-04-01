"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printResults = void 0;
var options_1 = require("./options");
if (options_1.options.help) {
    console.log('Available flags:');
    console.log('--json\t\t\t\tPrint in a json array format.');
    console.log('--raw\t\t\t\tPrint in raw format (default)');
    console.log('--dependents\t\t\t\tReturn transitive dependencies instead of direct dependencies');
    console.log('\n');
    process.exit(0);
}
function printResults(results) {
    if (options_1.options.outFormat === options_1.STDOUT_FORMAT.JSON) {
        var locations = results.map(function (project) { return project.packageName; });
        console.log(JSON.stringify(locations));
        return;
    }
    if (options_1.options.outFormat === options_1.STDOUT_FORMAT.RAW) {
        results.forEach(function (project) {
            console.log(project.packageName);
        });
    }
}
exports.printResults = printResults;
//# sourceMappingURL=output.js.map