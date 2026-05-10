use crate::{constant::APP_NAME, typings::InstanceInfo};

/**
 * GET /v2/health-check
 * static route
 * returns service instance info (envelope added in router)
 */
pub fn health_check() -> InstanceInfo {
  InstanceInfo { name: APP_NAME }
}
