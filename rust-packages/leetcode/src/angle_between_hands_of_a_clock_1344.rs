pub fn angle_clock(hour: i32, minutes: i32) -> f64 {
    let (h, m) = (hour as f64, minutes as f64);
    const ONE_MIN_ANGLE: f64 = 6.0;
    const ONE_HOUR_ANGLE: f64 = 30.0;

    let minutes_angle = ONE_MIN_ANGLE * m;
    let hour_angle = ((h % 12.0) + m / 60.0) * ONE_HOUR_ANGLE;

    let diff = (hour_angle - minutes_angle).abs();
    diff.min(360.0 - diff)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < 1e-5
    }

    #[test]
    fn example1() {
        // hour=12, minutes=30 → 165°
        assert!(approx_eq(angle_clock(12, 30), 165.0));
    }

    #[test]
    fn example2() {
        // hour=3, minutes=30 → 75°
        assert!(approx_eq(angle_clock(3, 30), 75.0));
    }

    #[test]
    fn example3() {
        // hour=3, minutes=15 → 7.5°
        assert!(approx_eq(angle_clock(3, 15), 7.5));
    }

    #[test]
    fn midnight() {
        // hour=12, minutes=0 → 0°
        assert!(approx_eq(angle_clock(12, 0), 0.0));
    }

    #[test]
    fn hour_wraps_12() {
        // hour=12 当作 0 处理，等价于 hour=0
        assert!(approx_eq(angle_clock(12, 0), angle_clock(0, 0)));
    }
}
