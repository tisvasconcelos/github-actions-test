import {
  RushConfiguration,
  RushConfigurationProject,
} from '@microsoft/rush-lib';
import { exec } from 'child_process';
import { options } from './options';
import { printResults } from './output';

const rushConfiguration = RushConfiguration.loadFromDefaultLocation();

const projectMap = rushConfiguration.projects.reduce(
  (projectMap: Record<string, RushConfigurationProject>, project) => {
    projectMap[project.projectRelativeFolder] = project;
    return projectMap;
  },
  {}
);

const projectLocations = Object.keys(projectMap);

function getAffectedProject(file: string): RushConfigurationProject | void {
  const match = projectLocations.find((location) => {
    return file.match(location);
  });
  if (!match) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return projectMap[match];
}

function getFiles(stdout: string): string[] {
  return stdout.split('\n');
}

function fromGitOutput(stdout: string): RushConfigurationProject[] {
  const files = getFiles(stdout);
  const affectedProjects = new Set<RushConfigurationProject>();

  files.forEach((file) => {
    const project = getAffectedProject(file);
    if (project) {
      affectedProjects.add(project);
    }
    if (file === 'common/config/rush/common-versions.json') {
      Object.values(projectMap).forEach((project) =>
        affectedProjects.add(project)
      );
    }
  });

  return [...affectedProjects];
}

function directProjects(): Promise<RushConfigurationProject[]> {
  const diffOption = options.sameBranch ? 'HEAD^' : 'origin/main HEAD';
  return new Promise((resolve, reject) => {
    exec(`git diff --name-only ${diffOption}`, (error, stdout, stderr) => {
      if (error) {
        reject({
          error,
          stderr,
        });
      }
      resolve(fromGitOutput(stdout));
    });
  });
}

async function transitiveProjects(): Promise<RushConfigurationProject[]> {
  const projects = await directProjects();

  const transitiveProjects = new Set<RushConfigurationProject>();

  function traverseProjects(
    projects: ReadonlySet<RushConfigurationProject>
  ): void {
    projects.forEach((project) => {
      project.consumingProjects.forEach((consumingProject) => {
        if (!transitiveProjects.has(consumingProject)) {
          transitiveProjects.add(consumingProject);
          traverseProjects(consumingProject.consumingProjects);
        }
      });
    });
  }

  traverseProjects(new Set<RushConfigurationProject>(projects));

  return [...transitiveProjects];
}

function main(): Promise<RushConfigurationProject[]> {
  if (options.dependents) {
    return transitiveProjects();
  }
  return directProjects();
}

main()
  .then((projects: RushConfigurationProject[]) => {
    printResults(projects);

    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
