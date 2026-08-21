import { WrapReadableStream, type ReadableStream, type WritableStream } from '@yume-chan/stream-extra';
import StreamSaver from '@yume-chan/stream-saver';

StreamSaver.mitm = `${import.meta.env.BASE_URL}StreamSaver/mitm.html`;

interface PickFileOptions {
  accept?: string;
}

interface PickFile {
  (options: { multiple: true } & PickFileOptions): Promise<FileList>;
  (options: { multiple?: false } & PickFileOptions): Promise<File | null>;
}

export const pickFile = (async (options: { multiple?: boolean } & PickFileOptions): Promise<FileList | File | null> => {
  return await new Promise<FileList | File | null>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (options.multiple) {
      input.multiple = true;
    }

    if (options.accept) {
      input.accept = options.accept;
    }

    input.onchange = () => {
      if (options.multiple) {
        resolve(input.files!);
      } else {
        resolve(input.files!.item(0));
      }
    };

    input.click();
  });
}) as PickFile;

export const saveFile = (fileName: string, size?: number) => {
  return StreamSaver.createWriteStream(fileName, {
    size
  }) as unknown as WritableStream<Uint8Array>;
};

export const createFileStream = (file: File) => {
  return new WrapReadableStream<Uint8Array>(file.stream() as unknown as ReadableStream<Uint8Array>);
};
