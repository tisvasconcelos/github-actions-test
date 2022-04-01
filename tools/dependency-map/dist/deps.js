"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var madge_1 = (0, tslib_1.__importDefault)(require("madge"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var baseDir = path_1.default.join(__dirname, '../../../apps/loft');
var tsConfig = require(path_1.default.join(baseDir, 'tsconfig.json'));
tsConfig.compilerOptions.baseUrl = baseDir;
function runMadge(relativePath) {
    return (0, madge_1.default)(path_1.default.join(baseDir, relativePath), {
        baseDir: baseDir,
        tsConfig: tsConfig,
        fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
        excludeRegExp: [
            /^\.next[\\/]/,
            /^next\.config\.js/,
            /^scripts[\\/]/,
            /^.*\.spec\..*/, // Ignore scripts (where this file lives)
        ],
    });
}
function traverse(graph, component, set) {
    if (set.has(component)) {
        return;
    }
    set.add(component);
    graph[component].forEach(function (child) {
        traverse(graph, child, set);
    });
}
function init() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var graph, deps, depsMap, key, _i, _a, dep;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.time('time to execution');
                    console.info('Running...');
                    return [4 /*yield*/, runMadge('pages')];
                case 1:
                    graph = (_b.sent()).obj();
                    deps = new Set();
                    traverse(graph, process.argv[2], deps);
                    depsMap = {};
                    for (key in graph) {
                        for (_i = 0, _a = graph[key]; _i < _a.length; _i++) {
                            dep = _a[_i];
                            if (deps.has(dep)) {
                                depsMap[dep] = depsMap[dep] ? depsMap[dep] + 1 : 1;
                            }
                        }
                    }
                    console.log(depsMap);
                    console.timeLog('time to execution');
                    return [2 /*return*/];
            }
        });
    });
}
void init();
//# sourceMappingURL=deps.js.map