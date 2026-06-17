pub fn process_str(s: String, k: i64) -> char {
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
