use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
  code: u16,
  message: String,
  data: T,
}

// 增加一些方法进行拼装
impl<T> ApiResponse<T> {
  pub fn success(data: T) -> Self {
    Self {
      code: 200,
      message: "success".to_string(),
      data,
    }
  }
  pub fn not_found(message: String, data: T) -> Self {
    Self {
      code: 404,
      message,
      data,
    }
  }
}
