import Mocha from 'mocha';
import sequence from 'promise-map-series';
import path from 'path';

const mocha = new Mocha();
const root = process.cwd();

export function handleAbsolute(moduleId, root) {
  if (path.isAbsolute(moduleId)) {
    return moduleId;
  } else {
    return path.join(root, moduleId);
  }
}

export async function importMochaModules(paths) {
  await sequence(paths, importMochaModule);
}

export async function importMochaModule(_moduleId) {
  const moduleId = handleAbsolute(_moduleId, root);
  mocha.suite.emit('pre-require', global, moduleId, mocha);
  let failed = true;

  try {
    await import(moduleId);
    failed =  false;
  } finally {
    if (failed) {
      // nodes current error messages arent useful yet
      console.error(`the module: '${moduleId}' failed to import.`);
    }

  }
  mocha.suite.emit('require', null, moduleId, mocha);
  mocha.suite.emit('post-require', global, moduleId, mocha);
}

export function extractArgs(argv) {
  const args = argv.slice();
  const bin = args.shift();
  const current = args.shift();

  return {
    args,
    bin,
    current
  };
}

let { args, bin, current } = extractArgs(process.argv);
importMochaModules(args).then(() => {
  mocha.run(failures => {
    process.on('exit', () => process.exit(failures > 0 ? 1 : 0));
  });
}).catch(e => {
  console.error(e);
  process.exit(1);
});
