export const delay = async (time: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    // Don't call `resolve` with any value.
    setTimeout(() => resolve(), time);
  });
};
