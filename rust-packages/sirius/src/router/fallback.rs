use axum::{
  Json,
  extract::Request,
  http::{Method, StatusCode},
};

use crate::{
  controllers::fallback::route_not_found_data,
  typings::{ApiResponse, RouteNotFoundData},
};

pub async fn fallback_handler(
  method: Method,
  request: Request,
) -> (StatusCode, Json<ApiResponse<RouteNotFoundData>>) {
  let uri = request.uri();
  let path = uri.path();
  let query = uri.query();
  let message = match query {
    Some(q) => format!("{} path {}?{} not found", method, path, q),
    None => format!("{} path {} not found", method, path),
  };
  let data = route_not_found_data(&method, path, query);
  (
    StatusCode::NOT_FOUND,
    Json(ApiResponse::not_found(message, data)),
  )
}
