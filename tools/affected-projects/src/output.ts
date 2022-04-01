import { RushConfigurationProject } from '@microsoft/rush-lib';
import { options, STDOUT_FORMAT } from './options';

if (options.help) {
  console.log('Available flags:');
  console.log('--json\t\t\t\tPrint in a json array format.');
  console.log('--raw\t\t\t\tPrint in raw format (default)');
  console.log(
    '--dependents\t\t\t\tReturn transitive dependencies instead of direct dependencies'
  );
  console.log('\n');
  process.exit(0);
}

export function printResults(results: RushConfigurationProject[]): void {
  if (options.outFormat === STDOUT_FORMAT.JSON) {
    const locations = results.map((project) => project.packageName);
    console.log(JSON.stringify(locations));
    return;
  }
  if (options.outFormat === STDOUT_FORMAT.RAW) {
    results.forEach((project) => {
      console.log(project.packageName);
    });
  }
}
