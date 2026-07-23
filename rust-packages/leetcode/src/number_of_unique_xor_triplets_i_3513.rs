pub fn unique_xor_triplets(nums: Vec<i32>) -> i32 {
    let n = nums.len() as i32;
    if n <= 2 {
        n
    } else {
        let mut res = 1;
        while res <= n {
            res <<= 1;
        }
        res
    }
}
