const numberOfPairs = (nums1: number[], nums2: number[], k: number): number => {
  const c1: Record<number, number> = {};
  const c2: Record<number, number> = {};
  let r = 0,
    m = 0;
  for (const num of nums1) {
    c1[num] = (c1[num] ?? 0) + 1;
    m = Math.max(m, num);
  }
  for (const num of nums2) {
    c2[num] = (c2[num] ?? 0) + 1;
  }
  for (const a in c2) {
    const cnt = c2[a]!;
    for (let b = Number(a) * k; b <= m; b += Number(a) * k) {
      if (b in c1) {
        r += c1[b]! * cnt;
      }
    }
  }
  return r;
};

export default numberOfPairs;
