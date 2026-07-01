/** 下标单调栈，用于 42. Trapping Rain Water */
pub struct Stack<T> {
    data: Vec<T>,
}

impl<T> Default for Stack<T> {
    fn default() -> Self {
        Self { data: Vec::new() }
    }
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn push(&mut self, val: T) {
        self.data.push(val);
    }

    /** 弹出栈顶，栈空时返回 None */
    pub fn pop(&mut self) -> Option<T> {
        self.data.pop()
    }

    /** 查看栈顶，栈空时返回 None */
    pub fn peek(&self) -> Option<&T> {
        self.data.last()
    }

    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }
}

/**
 * 42. Trapping Rain Water
 *
 * 单调栈解法：维护一个下标递减栈，遇到更高柱时弹栈计算积水。
 * 时间复杂度 O(n)，空间复杂度 O(n)。
 */
pub fn trap(height: Vec<i32>) -> i32 {
    let mut ans = 0;
    let mut stack: Stack<usize> = Stack::new();

    for i in 0..height.len() {
        // 当前柱高于栈顶时，可能形成凹槽，持续弹栈计算积水
        while stack.peek().is_some_and(|&top| height[i] > height[top]) {
            if let Some(top) = stack.pop()
                && let Some(&left) = stack.peek()
            {
                let width = (i - left - 1) as i32;
                let bounded_height = height[left].min(height[i]) - height[top];
                ans += bounded_height * width;
                // 栈为空说明左侧无边界，该凹槽无法积水
            }
        }
        stack.push(i);
    }

    ans
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        // height = [0,1,0,2,1,0,1,3,2,1,2,1] → 6
        assert_eq!(trap(vec![0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
    }

    #[test]
    fn example2() {
        // height = [4,2,0,3,2,5] → 9
        assert_eq!(trap(vec![4, 2, 0, 3, 2, 5]), 9);
    }

    #[test]
    fn flat() {
        assert_eq!(trap(vec![1, 1, 1]), 0);
    }

    #[test]
    fn single() {
        assert_eq!(trap(vec![3]), 0);
    }

    #[test]
    fn empty() {
        assert_eq!(trap(vec![]), 0);
    }

    #[test]
    fn descending() {
        assert_eq!(trap(vec![3, 2, 1]), 0);
    }

    #[test]
    fn ascending() {
        assert_eq!(trap(vec![1, 2, 3]), 0);
    }
}
