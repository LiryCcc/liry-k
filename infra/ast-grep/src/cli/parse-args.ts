import { z } from 'zod/v4';

type ParsedCli =
  | {
      command: 'find';
      lang: string;
      pattern: string;
      paths: string[];
      json: boolean;
    }
  | {
      command: 'rewrite';
      lang: string;
      pattern: string;
      rewrite: string;
      paths: string[];
      updateAll: boolean;
      json: boolean;
    }
  | {
      command: 'parse';
      lang: string;
      pattern?: string;
      paths: string[];
      json: boolean;
    }
  | {
      command: 'kind';
      lang: string;
      kindName: string;
      json: boolean;
    }
  | { command: 'help' };

const FLAG_SCHEMA = z.enum([
  '-l',
  '--lang',
  '-p',
  '--pattern',
  '-r',
  '--rewrite',
  '-U',
  '--update-all',
  '--json',
  '-h',
  '--help'
]);

const readFlagValue = (argv: string[], index: number): { value: string; nextIndex: number } => {
  const value = argv[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`missing value for ${argv[index]}`);
  }

  return {
    value,
    nextIndex: index + 1
  };
};

const parseCliArgs = (argv: string[]): ParsedCli | null => {
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    return { command: 'help' };
  }

  const commandResult = z.enum(['find', 'rewrite', 'parse', 'kind']).safeParse(argv[0]);
  if (!commandResult.success) {
    return null;
  }

  const command = commandResult.data;
  const flags = argv.slice(1);
  let lang: string | undefined;
  let pattern: string | undefined;
  let rewrite: string | undefined;
  let updateAll = false;
  let json = false;
  const paths: string[] = [];

  for (let index = 0; index < flags.length; index += 1) {
    const token = flags[index];

    if (!FLAG_SCHEMA.safeParse(token).success) {
      if (token) {
        paths.push(token);
      }
      continue;
    }

    if (token === '-U' || token === '--update-all') {
      updateAll = true;
      continue;
    }

    if (token === '--json') {
      json = true;
      continue;
    }

    if (token === '-h' || token === '--help') {
      return { command: 'help' };
    }

    const { value, nextIndex } = readFlagValue(flags, index);
    index = nextIndex;

    if (token === '-l' || token === '--lang') {
      lang = value;
      continue;
    }

    if (token === '-p' || token === '--pattern') {
      pattern = value;
      continue;
    }

    if (token === '-r' || token === '--rewrite') {
      rewrite = value;
    }
  }

  if (!lang) {
    throw new Error('missing required flag: --lang');
  }

  if (command === 'find') {
    if (!pattern) {
      throw new Error('find requires --pattern');
    }

    return {
      command,
      lang,
      pattern,
      paths,
      json
    };
  }

  if (command === 'rewrite') {
    if (!pattern) {
      throw new Error('rewrite requires --pattern');
    }

    if (!rewrite) {
      throw new Error('rewrite requires --rewrite');
    }

    return {
      command,
      lang,
      pattern,
      rewrite,
      paths,
      updateAll,
      json
    };
  }

  if (command === 'parse') {
    const result: Extract<ParsedCli, { command: 'parse' }> = {
      command,
      lang,
      paths,
      json
    };

    if (pattern) {
      result.pattern = pattern;
    }

    return result;
  }

  const kindName = paths[0];
  if (!kindName) {
    throw new Error('kind requires a kind name argument');
  }

  return {
    command,
    lang,
    kindName,
    json
  };
};

export { parseCliArgs };
export type { ParsedCli };
