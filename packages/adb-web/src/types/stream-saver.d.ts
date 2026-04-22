declare module '@yume-chan/stream-saver' {
  const StreamSaver: {
    mitm: string;
    createWriteStream: (fileName: string, opts?: { size?: number }) => WritableStream<Uint8Array>;
  };
  export default StreamSaver;
}
