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

  if [[ -n "${TEST_SRCDIR:-}" && -d "${TEST_SRCDIR}/_main" ]]; then
    printf '%s' "${TEST_SRCDIR}/_main"
    return 0
  fi

  return 1
}

workspace="$(resolve_workspace || true)"
if [[ -z "${workspace}" ]]; then
  echo "Cannot locate workspace root" >&2
  exit 1
fi

cd "${workspace}"
exec "$@"
