"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var madge_1 = (0, tslib_1.__importDefault)(require("madge"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var baseDir = path_1.default.join(__dirname, '../../../apps/loft');
var tsConfig = require(path_1.default.join(baseDir, 'tsconfig.json'));
tsConfig.compilerOptions.baseUrl = baseDir;
function traverse(madge, component, set) {
    if (set.has(component)) {
        return;
    }
    set.add(component);
    madge.depends(component).forEach(function (parent) {
        traverse(madge, parent, set);
    });
}
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
function init() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var pagesGraph, set, pages;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.time('time to execution');
                    console.info('Running...');
                    return [4 /*yield*/, runMadge('pages')];
                case 1:
                    pagesGraph = _a.sent();
                    set = new Set();
                    console.log(process.argv);
                    traverse(pagesGraph, process.argv[2], set);
                    pages = Array.from(set).filter(function (item) { return item.startsWith('pages'); });
                    console.log(pages);
                    console.timeLog('time to execution');
                    return [2 /*return*/];
            }
        });
    });
}
void init();
//# sourceMappingURL=findPages.js.map