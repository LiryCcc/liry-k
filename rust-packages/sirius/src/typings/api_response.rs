use axum::{
  Json,
  response::{IntoResponse, Response},
};
use std::collections::BTreeMap;

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

/// One query key's values (`application/x-www-form-urlencoded`): one pair → JSON string; repeated key → JSON array.
#[derive(Serialize)]
#[serde(untagged)]
pub enum QueryFieldValue {
  Single(String),
  Multiple(Vec<String>),
}

/// Payload for [`ApiResponse`] when the service reports a missing route or resource (e.g. HTTP 404).
#[derive(Serialize)]
pub struct RouteNotFoundData {
  pub method: String,
  pub path: String,
  /// Parsed query when the URI had `?…`: `a=1` → `{"a":"1"}`; `a=1&a=2` → `{"a":["1","2"]}`.
  pub query: Option<BTreeMap<String, QueryFieldValue>>,
}

/// Wraps controller output so routes return [`ApiResponse`] through [`IntoResponse`] without repeating [`Json`].
pub struct ApiOk<T>(pub T);

impl<T: Serialize> IntoResponse for ApiOk<T> {
  fn into_response(self) -> Response {
    Json(ApiResponse::success(self.0)).into_response()
  }
}
