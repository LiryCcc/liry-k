import { runCli } from './cli/run-cli.js';

const exitCode = await runCli(process.argv.slice(2));
process.exitCode = exitCode;
