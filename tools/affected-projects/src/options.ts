export enum STDOUT_FORMAT {
  JSON,
  RAW,
}

const args = new Set(process.argv.slice(2));
let outFormat = STDOUT_FORMAT.RAW;

if (args.has('--json')) {
  outFormat = STDOUT_FORMAT.JSON;
}

export const options = {
  help: args.has('--help'),
  outFormat,
  dependents: args.has('--dependents'),
  sameBranch: args.has('--same-branch'),
};
