const destCity = (paths: string[][]): string | undefined => {
  const ca = new Set<string>();
  for (const p of paths) {
    ca.add(p[0]!);
  }
  for (const p of paths) {
    if (!ca.has(p[1]!)) {
      return p[1];
    }
  }
  return undefined;
};

export default destCity;
