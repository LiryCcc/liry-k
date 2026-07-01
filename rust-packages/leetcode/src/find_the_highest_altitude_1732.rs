pub fn largest_altitude(gain: Vec<i32>) -> i32 {
    gain.into_iter()
        .fold((0, 0), |(c, m), d| (c + d, (c + d).max(m)))
        .1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        // [-5,1,5,0,-7] → 累计高度: -5,-4,1,1,-6 最大为 1
        assert_eq!(largest_altitude(vec![-5, 1, 5, 0, -7]), 1);
    }

    #[test]
    fn example2() {
        // [-4,-3,-2,-1,4,3,2] → 累计: -4,-7,-9,-10,-6,-3,-1 起点0最大，最大为 0
        assert_eq!(largest_altitude(vec![-4, -3, -2, -1, 4, 3, 2]), 0);
    }

    #[test]
    fn all_positive() {
        assert_eq!(largest_altitude(vec![1, 2, 3]), 6);
    }

    #[test]
    fn single_element_negative() {
        // 起点高度0 > -5，返回 0
        assert_eq!(largest_altitude(vec![-5]), 0);
    }

    #[test]
    fn single_element_positive() {
        assert_eq!(largest_altitude(vec![3]), 3);
    }
}
