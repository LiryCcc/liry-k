pub fn remove_element(nums: &mut [i32], val: i32) -> i32 {
    let mut stack_size = 0;
    for i in 0..nums.len() {
        if nums[i] != val {
            nums[stack_size] = nums[i];
            stack_size += 1;
        }
    }
    stack_size as _
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        let mut nums = vec![3, 2, 2, 3];
        let k = remove_element(&mut nums, 3) as usize;
        assert_eq!(k, 2);
        let mut result = nums[..k].to_vec();
        result.sort();
        assert_eq!(result, vec![2, 2]);
    }

    #[test]
    fn example2() {
        let mut nums = vec![0, 1, 2, 2, 3, 0, 4, 2];
        let k = remove_element(&mut nums, 2) as usize;
        assert_eq!(k, 5);
        let mut result = nums[..k].to_vec();
        result.sort();
        assert_eq!(result, vec![0, 0, 1, 3, 4]);
    }

    #[test]
    fn remove_all() {
        let mut nums = vec![1, 1, 1];
        assert_eq!(remove_element(&mut nums, 1), 0);
    }

    #[test]
    fn remove_none() {
        let mut nums = vec![1, 2, 3];
        assert_eq!(remove_element(&mut nums, 9), 3);
        assert_eq!(&nums[..3], &[1, 2, 3]);
    }

    #[test]
    fn empty_input() {
        let mut nums: Vec<i32> = vec![];
        assert_eq!(remove_element(&mut nums, 0), 0);
    }
}
