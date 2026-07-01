/**
 * @param s - 字符串（仅含 a/b/c）
 * @param k - 每种字符最少保留数量
 */
const takeCharacters = (s: string, k: number): number => {
  const cnt: Record<string, number> = { a: 0, b: 0, c: 0 };
  const len = s.length;
  let ans = len;
  for (let i = 0; i < len; i++) {
    cnt[s[i]!]!++;
  }
  console.dir(`${cnt['a']} ${cnt['b']} ${cnt['c']}`);
  if (cnt['a']! >= k && cnt['b']! >= k && cnt['c']! >= k) {
    ans = Math.min(ans, len);
  } else {
    return -1;
  }
  let l = 0;
  for (let r = 0; r < len; r++) {
    cnt[s[r]!]!--;
    while (l < r && (cnt['a']! < k || cnt['b']! < k || cnt['c']! < k)) {
      cnt[s[l]!]!++;
      l++;
    }
    if (cnt['a']! >= k && cnt['b']! >= k && cnt['c']! >= k) {
      ans = Math.min(ans, len - (r - l + 1));
    }
  }
  return ans;
};

export default takeCharacters;
