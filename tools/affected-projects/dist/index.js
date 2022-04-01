"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rush_lib_1 = require("@microsoft/rush-lib");
var child_process_1 = require("child_process");
var options_1 = require("./options");
var output_1 = require("./output");
var rushConfiguration = rush_lib_1.RushConfiguration.loadFromDefaultLocation();
var projectMap = rushConfiguration.projects.reduce(function (projectMap, project) {
    projectMap[project.projectRelativeFolder] = project;
    return projectMap;
}, {});
var projectLocations = Object.keys(projectMap);
function getAffectedProject(file) {
    var match = projectLocations.find(function (location) {
        return file.match(location);
    });
    if (!match) {
        return;
    }
    // eslint-disable-next-line consistent-return
    return projectMap[match];
}
function getFiles(stdout) {
    return stdout.split('\n');
}
function fromGitOutput(stdout) {
    var files = getFiles(stdout);
    var affectedProjects = new Set();
    files.forEach(function (file) {
        var project = getAffectedProject(file);
        if (project) {
            affectedProjects.add(project);
        }
        if (file === 'common/config/rush/common-versions.json') {
            Object.values(projectMap).forEach(function (project) {
                return affectedProjects.add(project);
            });
        }
    });
    return tslib_1.__spreadArray([], tslib_1.__read(affectedProjects), false);
}
function directProjects() {
    var diffOption = options_1.options.sameBranch ? 'HEAD^' : 'origin/main HEAD';
    return new Promise(function (resolve, reject) {
        (0, child_process_1.exec)("git diff --name-only ".concat(diffOption), function (error, stdout, stderr) {
            if (error) {
                reject({
                    error: error,
                    stderr: stderr,
                });
            }
            resolve(fromGitOutput(stdout));
        });
    });
}
function transitiveProjects() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function traverseProjects(projects) {
            projects.forEach(function (project) {
                project.consumingProjects.forEach(function (consumingProject) {
                    if (!transitiveProjects.has(consumingProject)) {
                        transitiveProjects.add(consumingProject);
                        traverseProjects(consumingProject.consumingProjects);
                    }
                });
            });
        }
        var projects, transitiveProjects;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, directProjects()];
                case 1:
                    projects = _a.sent();
                    transitiveProjects = new Set();
                    traverseProjects(new Set(projects));
                    return [2 /*return*/, tslib_1.__spreadArray([], tslib_1.__read(transitiveProjects), false)];
            }
        });
    });
}
function main() {
    if (options_1.options.dependents) {
        return transitiveProjects();
    }
    return directProjects();
}
main()
    .then(function (projects) {
    (0, output_1.printResults)(projects);
    process.exit(0);
})
    .catch(function (error) {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map