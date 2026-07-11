/**
 * 两数之和
 * for i in nums，如果map.get(i)存在，则返回[i, map.get(i)]，否则map.insert(target - i, i)
 */
pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map: std::collections::HashMap<i32, i32> = std::collections::HashMap::new();
    for (_index, num) in nums.into_iter().enumerate() {
        let index = _index as i32;
        let need = target - num;

        if let Some(&prev_index) = map.get(&need) {
            return vec![prev_index, index];
        }
        map.insert(num, index);
    }
    vec![]
}
