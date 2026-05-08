use crate::{controllers, typings::ApiResponse};
use axum::{Json, Router, routing::get};
pub fn v2_routes() -> Router {
  Router::new().route(
    "/health-check",
    get(|| async {
      Json(ApiResponse::success(
        controllers::v2::health_check::health_check(),
      ))
    }),
  )
}
