#!/usr/bin/env bash
set -euo pipefail

resolve_workspace() {
  if [[ -n "${BUILD_WORKSPACE_DIRECTORY:-}" ]]; then
    printf '%s' "${BUILD_WORKSPACE_DIRECTORY}"
    return 0
  fi

  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
  while [[ "${dir}" != "/" ]]; do
    if [[ -f "${dir}/MODULE.bazel" && -f "${dir}/package.json" ]]; then
      printf '%s' "${dir}"
      return 0
    fi
    dir="$(dirname "${dir}")"
  done

  return 1
}

workspace="$(resolve_workspace || true)"
if [[ -z "${workspace}" ]]; then
  echo "Cannot locate workspace root" >&2
  exit 1
fi

cd "${workspace}"
bash tools/bazel/check-root.sh
pnpm -r --parallel lint
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo fmt --all --check
./gradlew :vega:classes --no-daemon
