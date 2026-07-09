pub fn max_profit(prices: Vec<i32>) -> i32 {
    let mut min_price = i32::MAX;
    let mut max_return = 0;
    let max = std::cmp::max;
    let min = std::cmp::min;
    for price in prices {
        max_return = max(max_return, price - min_price);
        min_price = min(price, min_price);
    }
    max_return
}
