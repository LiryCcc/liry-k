use crate::constant::{APP_NAME, APP_VERSION};
mod constant;
mod typings;
use crate::router::create_router;
mod controllers;
mod router;

#[tokio::main]
async fn main() {
  println!("{} start version {}", APP_NAME, APP_VERSION);
  let app = create_router();
  let listener = tokio::net::TcpListener::bind("0.0.0.0:14144")
    .await
    .unwrap();
  axum::serve(listener, app).await.unwrap();
}
