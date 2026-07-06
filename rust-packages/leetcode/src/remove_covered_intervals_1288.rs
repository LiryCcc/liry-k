pub fn remove_covered_intervals(intervals: Vec<Vec<i32>>) -> i32 {
    let n = intervals.len();
    let mut ans = n as i32;
    for i in 0..n {
        for j in 0..n {
            if i != j && intervals[j][0] <= intervals[i][0] && intervals[i][1] <= intervals[j][1] {
                ans -= 1;
                break;
            }
        }
    }
    ans
}
