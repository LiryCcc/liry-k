use crate::{controllers, typings::ApiOk};
use axum::{Router, routing::get};

pub fn v1_routes() -> Router {
  Router::new().route(
    "/health-check",
    get(|| async { ApiOk(controllers::v1::health_check::health_check()) }),
  )
}
