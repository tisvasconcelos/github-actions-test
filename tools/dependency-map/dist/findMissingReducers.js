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
function init() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var pagesGraph, firstChildren, _i, _a, _b, key, children, _c, children_1, child, reducersGraph, reducers, _d, reducers_1, reducer;
        return (0, tslib_1.__generator)(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.time('time to execution');
                    // const args = getParams();
                    console.info('Running...');
                    return [4 /*yield*/, runMadge('pages')];
                case 1:
                    pagesGraph = (_e.sent()).obj();
                    firstChildren = {};
                    for (_i = 0, _a = Object.entries(pagesGraph); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], children = _b[1];
                        if (key.startsWith('pages')) {
                            for (_c = 0, children_1 = children; _c < children_1.length; _c++) {
                                child = children_1[_c];
                                if (firstChildren[child]) {
                                    firstChildren[child].push(key);
                                }
                                else {
                                    firstChildren[child] = [key];
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, runMadge('store/reducers.ts')];
                case 2:
                    reducersGraph = (_e.sent()).obj();
                    reducers = reducersGraph['store/reducers.ts'];
                    for (_d = 0, reducers_1 = reducers; _d < reducers_1.length; _d++) {
                        reducer = reducers_1[_d];
                        if (!firstChildren[reducer]) {
                            console.log(reducer);
                        }
                    }
                    // console.log(firstChildren);
                    console.timeLog('time to execution');
                    return [2 /*return*/];
            }
        });
    });
}
void init();
//# sourceMappingURL=findMissingReducers.js.map