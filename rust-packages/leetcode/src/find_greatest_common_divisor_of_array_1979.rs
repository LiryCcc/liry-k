/**
 * 找出最大数和最小数的最大公约数
 */
pub fn find_gcd(nums: Vec<i32>) -> i32 {
    let mut min = nums[0];
    let mut max = nums[0];
    for num in nums {
        if num < min {
            min = num;
        } else if num > max {
            max = num;
        }
    }
    gcd(min, max)
}

fn gcd(a: i32, b: i32) -> i32 {
    if b == 0 { a } else { gcd(b, a % b) }
}
