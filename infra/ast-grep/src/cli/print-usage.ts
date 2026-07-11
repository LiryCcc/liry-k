const printCliUsage = (): void => {
  const lines = [
    'Usage: liry-sg <command> [options] [paths...]',
    '',
    'Commands:',
    '  find     Search code by AST pattern',
    '  rewrite  Rewrite code by AST pattern',
    '  parse    Parse source and optionally match a pattern',
    '  kind     Resolve syntax kind name to numeric id',
    '',
    'Global options:',
    '  -l, --lang <lang>     Language (typescript, tsx, javascript, html, css)',
    '  -p, --pattern <pat>   AST pattern',
    '  -r, --rewrite <text>  Rewrite template (rewrite command)',
    '  -U, --update-all      Write changes back to files (rewrite command)',
    '  --json                Print JSON output',
    '  -h, --help            Show help',
    '',
    'Examples:',
    "  liry-sg find -l typescript -p 'function $NAME' packages/luna",
    "  liry-sg rewrite -l typescript -p 'function $NAME($$$) { $$$BODY }' \\",
    "    -r 'const $NAME = ($$$) => { $$$BODY }' -U packages/foo",
    '  liry-sg parse -l typescript -p \'import $$$ from "$M"\' file.ts',
    '  liry-sg kind -l typescript function_declaration'
  ];

  console.log(lines.join('\n'));
};

export { printCliUsage };
