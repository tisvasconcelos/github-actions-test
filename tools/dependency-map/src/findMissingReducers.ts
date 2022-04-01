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

async function init() {
  console.time('time to execution');
  // const args = getParams();
  console.info('Running...');

  const pagesGraph = (await runMadge('pages')).obj();

  const firstChildren: Record<string, string[]> = {};
  for (const [key, children] of Object.entries(pagesGraph)) {
    if (key.startsWith('pages')) {
      for (const child of children) {
        if (firstChildren[child]) {
          firstChildren[child].push(key);
        } else {
          firstChildren[child] = [key];
        }
      }
    }
  }

  const reducersGraph = (await runMadge('store/reducers.ts')).obj();

  const reducers = reducersGraph['store/reducers.ts'];

  for (const reducer of reducers) {
    if (!firstChildren[reducer]) {
      console.log(reducer);
    }
  }

  // console.log(firstChildren);

  console.timeLog('time to execution');
}

void init();
