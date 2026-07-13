pub fn sequential_digits(low: i32, high: i32) -> Vec<i32> {
    let mut res: Vec<i32> = vec![];
    for i in 1..=9 {
        let mut num = i;
        for j in (i + 1)..=9 {
            num = num * 10 + j;
            if num >= low && num <= high {
                res.push(num);
            }
        }
    }
    res.sort();
    res
}
