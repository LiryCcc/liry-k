pub fn process_str(s: String, k: i64) -> char {
    // s: 由普通字符与特殊操作符 '*'（删末尾）、'#'（重复）、'%'（翻转）组成
    // k: 最终字符串中的目标下标（0-based），超出则返回 '.'
    let total_len = s.chars().fold(0i64, |acc, c| match c {
        '*' => {
            if acc > 0 {
                acc - 1
            } else {
                acc
            }
        }
        '#' => acc * 2,
        '%' => acc,
        _ => acc + 1,
    });

    if k + 1 > total_len {
        return '.';
    }
    let (_, _, res_char) =
        s.chars()
            .rev()
            .fold((total_len, k, '.'), |(len_state, k_state, char_res), c| {
                if char_res != '.' {
                    return (len_state, k_state, char_res);
                }

                match c {
                    '*' => (len_state + 1, k_state, char_res),
                    '#' => {
                        let half = len_state / 2;
                        let new_len = (len_state + 1) / 2;
                        let new_k = if k_state + 1 > new_len {
                            k_state - half
                        } else {
                            k_state
                        };
                        (new_len, new_k, char_res)
                    }
                    '%' => (len_state, len_state - k_state - 1, char_res),
                    normal_char => {
                        if k_state + 1 == len_state {
                            (len_state - 1, k_state, normal_char)
                        } else {
                            (len_state - 1, k_state, char_res)
                        }
                    }
                }
            });

    res_char
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plain_string() {
        // "abc" → ['a','b','c']，k=0→'a', k=2→'c'
        assert_eq!(process_str("abc".to_string(), 0), 'a');
        assert_eq!(process_str("abc".to_string(), 2), 'c');
    }

    #[test]
    fn out_of_bounds() {
        assert_eq!(process_str("abc".to_string(), 3), '.');
    }

    #[test]
    fn star_delete() {
        // "ab*" → "ab" 删末尾 → "a"，k=0→'a', k=1→'.'
        assert_eq!(process_str("ab*".to_string(), 0), 'a');
        assert_eq!(process_str("ab*".to_string(), 1), '.');
    }

    #[test]
    fn hash_double() {
        // "ab#" → "abab"，k=0→'a', k=2→'a', k=3→'b'
        assert_eq!(process_str("ab#".to_string(), 0), 'a');
        assert_eq!(process_str("ab#".to_string(), 2), 'a');
        assert_eq!(process_str("ab#".to_string(), 3), 'b');
    }

    #[test]
    fn percent_reverse() {
        // "ab%" → "ba"，k=0→'b', k=1→'a'
        assert_eq!(process_str("ab%".to_string(), 0), 'b');
        assert_eq!(process_str("ab%".to_string(), 1), 'a');
    }

    #[test]
    fn combined_ops() {
        // "ab#%" → "abab" 再翻转 → "baba"，k=0→'b', k=1→'a'
        assert_eq!(process_str("ab#%".to_string(), 0), 'b');
        assert_eq!(process_str("ab#%".to_string(), 1), 'a');
    }

    #[test]
    fn star_on_empty() {
        // "*" → 空串，k=0 超出 → '.'
        assert_eq!(process_str("*".to_string(), 0), '.');
    }
}
