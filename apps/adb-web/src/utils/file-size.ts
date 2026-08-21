import { Consumable, InspectStream } from '@yume-chan/stream-extra';

const units = [' B', ' KB', ' MB', ' GB'];

const shrinkUnit = (v: number, index: number): [number, number] => {
  if (index >= units.length || v <= 1024) {
    return [v, index];
  }
  return shrinkUnit(v / 1024, index + 1);
};

export const formatSize = (value: number): string => {
  const [v, index] = shrinkUnit(value, 0);
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 }) + units[index];
};

export const formatSpeed = (completed: number, total: number, speed: number): string | undefined => {
  if (total === 0) {
    return undefined;
  }
  return `${formatSize(completed)} / ${formatSize(total)}（${formatSize(speed)}/s）`;
};

/** InspectStream that reports cumulative byte length via callback. */
export const createProgressStream = (onProgress: (value: number) => void) => {
  const tally = { bytes: 0 };
  return new InspectStream<Consumable<Uint8Array>>((chunk) => {
    tally.bytes += chunk.value.byteLength;
    onProgress(tally.bytes);
  });
};
