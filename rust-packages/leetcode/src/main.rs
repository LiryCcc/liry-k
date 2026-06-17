use leetcode::process_string_with_special_operations_ii;

fn main() {
    println!(
        "3614 {}",
        process_string_with_special_operations_ii::process_str("a#b%*".to_owned(), 1) == 'a'
    );
}
