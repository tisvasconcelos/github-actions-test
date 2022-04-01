import madge from 'madge';
import path from 'path';

const baseDir = path.join(__dirname, '../../../apps/loft');

const tsConfig = require(path.join(baseDir, 'tsconfig.json'));

tsConfig.compilerOptions.baseUrl = baseDir;

function traverse(
  madge: madge.MadgeInstance,
  component: string,
  set: Set<string>
): void {
  if (set.has(component)) {
    return;
  }

  set.add(component);

  madge.depends(component).forEach((parent) => {
    traverse(madge, parent, set);
  });
}

function runMadge(relativePath: string): Promise<madge.MadgeInstance> {
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

async function init(): Promise<void> {
  console.time('time to execution');
  console.info('Running...');

  const pagesGraph = await runMadge('pages');

  const set = new Set<string>();

  console.log(process.argv);

  traverse(pagesGraph, process.argv[2], set);

  const pages = Array.from(set).filter((item) => item.startsWith('pages'));

  console.log(pages);
  console.timeLog('time to execution');
}

void init();
