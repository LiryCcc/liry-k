use serde::Serialize;

#[derive(Serialize)]
pub struct InstanceInfo {
  pub name: &'static str,
}
