import { multiDownload } from '../js-api.js';
import type { DownloadOptions } from '../types.js';
import { formatBytes } from './format-bytes.js';
import { parseCliArgs, printCliUsage } from './parse-args.js';

const runCli = async (argv: string[]): Promise<number> => {
  const parsed = parseCliArgs(argv);

  if (!parsed) {
    printCliUsage();
    return 1;
  }

  let lastLineLength = 0;

  const downloadOptions: DownloadOptions = {
    url: parsed.url,
    outputPath: parsed.outputPath,
    threads: parsed.threads,
    retries: parsed.retries,
    resume: parsed.resume,
    onProgress: (progress) => {
      const line = `progress ${progress.percent.toFixed(2)}% (${formatBytes(progress.downloadedBytes)} / ${formatBytes(progress.totalBytes)})`;
      const padding = lastLineLength > line.length ? ' '.repeat(lastLineLength - line.length) : '';
      process.stdout.write(`\r${line}${padding}`);
      lastLineLength = line.length;
    }
  };

  if (parsed.checksums.length > 0) {
    downloadOptions.checksums = parsed.checksums;
  }

  const result = await multiDownload(downloadOptions);

  process.stdout.write('\n');
  console.log(`saved to ${result.outputPath}`);

  if (result.checksumResults.length > 0) {
    const labels = result.checksumResults.map((item) => item.algorithm).join(', ');
    console.log(`checksum verified: ${labels}`);
  }

  return 0;
};

export { runCli };
