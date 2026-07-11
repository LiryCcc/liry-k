/**
 * 移动0 将所有0移动到尾部
 * l在已处理好的尾部，r在未处理的头部
 *
 */
pub fn move_zeroes(nums: &mut [i32]) {
    if nums.len() <= 1 {
        return;
    }
    let mut l = 0;
    let mut r = 0;

    while r < nums.len() {
        if nums[r] != 0 {
            nums.swap(l, r);
            l += 1;
        }
        r += 1;
    }
}
