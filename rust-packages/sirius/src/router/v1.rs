use crate::{controllers, typings::ApiResponse};
use axum::{Json, Router, routing::get};
pub fn v1_routes() -> Router {
  Router::new().route(
    "/health-check",
    get(|| async {
      Json(ApiResponse::success(
        controllers::v1::health_check::health_check(),
      ))
    }),
  )
}
