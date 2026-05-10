use axum::Router;

mod fallback;
mod v1;
mod v2;

use fallback::fallback_handler;
use v1::v1_routes;
use v2::v2_routes;
pub fn create_router() -> Router {
  Router::new()
    .nest("/v1", v1_routes())
    .nest("/v2", v2_routes())
    .fallback(fallback_handler)
}
