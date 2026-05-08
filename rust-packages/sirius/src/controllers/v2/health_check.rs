use crate::typings::InstanceInfo;

/**
 * /v1/hello
 * static route
 * return timestamp version and service instance info
 */

pub fn health_check() -> InstanceInfo {
  let res = InstanceInfo {
    name: "1".to_string(),
  };
  return res;
}
