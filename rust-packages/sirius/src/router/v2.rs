use crate::{controllers, typings::ApiOk};
use axum::{Router, routing::get};

pub fn v2_routes() -> Router {
  Router::new().route(
    "/health-check",
    get(|| async { ApiOk(controllers::v2::health_check::health_check()) }),
  )
}
