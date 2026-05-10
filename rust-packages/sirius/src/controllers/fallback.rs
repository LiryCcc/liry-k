use std::collections::BTreeMap;

use axum::http::Method;
use url::form_urlencoded::parse;

use crate::typings::{QueryFieldValue, RouteNotFoundData};

fn query_str_to_map(raw: &str) -> BTreeMap<String, QueryFieldValue> {
  let mut grouped: BTreeMap<String, Vec<String>> = BTreeMap::new();
  for (key, value) in parse(raw.as_bytes()).into_owned() {
    grouped.entry(key).or_default().push(value);
  }
  grouped
    .into_iter()
    .map(|(key, values)| {
      let value = match values.len() {
        1 => QueryFieldValue::Single({
          let mut values = values;
          values.remove(0)
        }),
        _ => QueryFieldValue::Multiple(values),
      };
      (key, value)
    })
    .collect()
}

pub fn route_not_found_data(method: &Method, path: &str, query: Option<&str>) -> RouteNotFoundData {
  RouteNotFoundData {
    method: method.as_str().to_string(),
    path: path.to_string(),
    query: query.map(query_str_to_map),
  }
}
