import { parseCliArgs } from './parse-args.js';
import { printCliUsage } from './print-usage.js';
import { runFindCommand, runKindCommand, runParseCommand, runRewriteCommand } from './run-commands.js';

const runCli = async (argv: string[]): Promise<number> => {
  try {
    const parsed = parseCliArgs(argv);

    if (!parsed || parsed.command === 'help') {
      printCliUsage();
      return parsed ? 0 : 1;
    }

    if (parsed.command === 'find') {
      return await runFindCommand(parsed);
    }

    if (parsed.command === 'rewrite') {
      return await runRewriteCommand(parsed);
    }

    if (parsed.command === 'parse') {
      return await runParseCommand(parsed);
    }

    return runKindCommand(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`liry-sg: ${message}`);
    return 1;
  }
};

export { runCli };
