use axum::{Json, extract::Request, http::Method};
use serde_json::Value;

use crate::typings::ApiResponse;

pub async fn fallback_handler(method: Method, request: Request) -> Json<ApiResponse<String>> {
  Json(ApiResponse::not_found(
    format!(
      "{} path {} not found",
      method.to_string(),
      request.uri().path().to_string()
    ),
    Value::Null.to_string(),
  ))
}
