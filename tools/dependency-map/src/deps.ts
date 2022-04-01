import madge from 'madge';
import path from 'path';

const baseDir = path.join(__dirname, '../../../apps/loft');

const tsConfig = require(path.join(baseDir, 'tsconfig.json'));

tsConfig.compilerOptions.baseUrl = baseDir;

function runMadge(relativePath: string) {
  return madge(path.join(baseDir, relativePath), {
    baseDir,
    tsConfig,
    fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    excludeRegExp: [
      /^\.next[\\/]/, // Ignore built artifacts
      /^next\.config\.js/, // Ignore Next.js configuration
      /^scripts[\\/]/, // Ignore scripts (where this file lives)
      /^.*\.spec\..*/, // Ignore scripts (where this file lives)
    ],
  });
}

function traverse(
  graph: Record<string, string[]>,
  component: string,
  set: Set<string>
): void {
  if (set.has(component)) {
    return;
  }

  set.add(component);

  graph[component].forEach((child) => {
    traverse(graph, child, set);
  });
}

async function init() {
  console.time('time to execution');
  console.info('Running...');

  const graph = (await runMadge('pages')).obj();
  const deps = new Set<string>();

  traverse(graph, process.argv[2], deps);

  const depsMap: Record<string, number> = {};

  for (const key in graph) {
    for (const dep of graph[key]) {
      if (deps.has(dep)) {
        depsMap[dep] = depsMap[dep] ? depsMap[dep] + 1 : 1;
      }
    }
  }

  console.log(depsMap);

  console.timeLog('time to execution');
}

void init();
