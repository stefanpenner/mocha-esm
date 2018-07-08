import Mocha from 'mocha';
import sequence from 'promise-map-series';
import path from 'path';
import minimist from 'minimist';

export function handleAbsolute(moduleId, root) {
  if (path.isAbsolute(moduleId)) {
    return moduleId;
  } else {
    return path.join(root, moduleId);
  }
}

export function normalizeOptionAliases(_options) {
  // don't mutating our arguments, rather deep clone and mutate the clone.
  const options = JSON.parse(JSON.stringify(_options))
  delete options._;

  if (options.g) {
    options.grep = options.g;
    delete options.g;
  }

  if (options.i) {
    options.invert = options.i;
    delete options.i;
  }

  return options;
}

export class Runner {
  constructor(mocha, root) {
    this.mocha = mocha;
    this.root = root;
  }

  async importModuleFiles(files) {
    await sequence(files, id => this.importModule(id));
  }

  async importModule(module) {
    const moduleId = handleAbsolute(module, this.root);
    this.mocha.suite.emit('pre-require', global, moduleId, this.mocha);

    try {
      await import(moduleId);
    } catch (e) {
      if (e !== null && typeof e === 'object' && e.name === 'SyntaxError') {
        e.message = `\n file: '${moduleId}'\n ${e.message}`;
      }
      throw e;
    }

    this.mocha.suite.emit('require', null, moduleId, this.mocha);
    this.mocha.suite.emit('post-require', global, moduleId, this.mocha);
  }

  async run() {
    return new Promise(resolve => {
      this.mocha.run(failures => resolve({ failures }));
    });
  }
}

export async function main(argv) {
  const options = minimist(argv);
  const files = options._;
  const mocha = new Mocha(normalizeOptionAliases(options));
  const root = process.cwd();
  const runner = new Runner(mocha, root);;

  try {
    await runner.importModuleFiles(files);

    let { failures } = await runner.run();

    process.exit(failures > 0 ? 1 : 0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

main(process.argv.slice(2));
