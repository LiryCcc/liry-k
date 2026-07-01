/**
 * @param nums1 - 第一个数组
 * @param nums2 - 第二个数组
 * @param k - 乘数
 */
const numberOfPairs = (nums1: number[], nums2: number[], k: number): number => {
  let n = 0;
  for (const i of nums1) {
    for (const j of nums2) {
      if (i % (j * k) === 0) {
        n++;
      }
    }
  }
  return n;
};

export default numberOfPairs;
