pub fn angle_clock(hour: i32, minutes: i32) -> f64 {
    let (h, m) = (hour as f64, minutes as f64);
    const ONE_MIN_ANGLE: f64 = 6.0;
    const ONE_HOUR_ANGLE: f64 = 30.0;

    let minutes_angle = ONE_MIN_ANGLE * m;
    let hour_angle = ((h % 12.0) + m / 60.0) * ONE_HOUR_ANGLE;

    let diff = (hour_angle - minutes_angle).abs();
    diff.min(360.0 - diff)
}
