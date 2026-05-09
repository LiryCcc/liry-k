use crate::{constant::APP_NAME, typings::InstanceInfo};

/**
 * /v1/hello
 * static route
 * return timestamp version and service instance info
 */
pub fn health_check() -> InstanceInfo {
  InstanceInfo { name: APP_NAME }
}
