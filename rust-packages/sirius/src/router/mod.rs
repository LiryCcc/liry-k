use axum::Router;

use crate::{
  controllers::fallback::fallback_handler,
  router::{v1::v1_routes, v2::v2_routes},
};
mod v1;
mod v2;
pub fn create_router() -> Router {
  Router::new()
    .nest("/v1", v1_routes())
    .nest("/v2", v2_routes())
    .fallback(fallback_handler)
}
