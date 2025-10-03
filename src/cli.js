import yargs from 'yargs';
import gitBranchIs from 'git-branch-is';
// eslint-disable-next-line import/extensions
import { Config } from './config.js';
// eslint-disable-next-line import/extensions
import { Linter } from './linter.js';

export default async function exec() {
  const argv = await yargs
    .usage('Usage: $0')
    .example('$0', 'Lint current branch')
    .help('h')
    .alias('h', 'help')
    .option('config', {
      alias: 'c',
      type: 'string',
      description: 'Config file path',
      default: null,
    }).argv;
  const config = new Config({ config: argv.config });

  gitBranchIs.getBranch().then(branchName => {
    const linter = new Linter(config);
    linter.lint(branchName);
  });
}
