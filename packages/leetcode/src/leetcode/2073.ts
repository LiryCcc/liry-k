/**
 * @param tickets - 票价数组
 * @param k - 目标人索引
 */
const timeRequiredToBuy = (tickets: number[], k: number): number => {
  let ans = 0;
  for (let i = 0; i < tickets.length; i++) {
    if (i <= k) {
      ans += tickets[k]! < tickets[i]! ? tickets[k]! : tickets[i]!;
    } else {
      ans += tickets[k]! - 1 < tickets[i]! ? tickets[k]! - 1 : tickets[i]!;
    }
  }
  return ans;
};

export default timeRequiredToBuy;
