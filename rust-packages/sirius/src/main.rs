use crate::constant::{APP_NAME, APP_VERSION, BIND_ADDR, BIND_PORT};
use std::error::Error;
mod constant;
mod typings;
use crate::router::create_router;
mod controllers;
mod router;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
  println!("{} start version {}", APP_NAME, APP_VERSION);
  let app = create_router();
  let listener = tokio::net::TcpListener::bind(BIND_ADDR).await?;
  println!("{} start at http://localhost:{}", APP_NAME, BIND_PORT);
  axum::serve(listener, app).await?;
  Ok(())
}
