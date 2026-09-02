#!/usr/bin/env bash
set -euo pipefail

resolve_workspace() {
  if [[ -n "${BUILD_WORKSPACE_DIRECTORY:-}" ]]; then
    printf '%s' "${BUILD_WORKSPACE_DIRECTORY}"
    return 0
  fi

  local dir="${PWD}"
  while [[ "${dir}" != "/" ]]; do
    if [[ -f "${dir}/MODULE.bazel" && -f "${dir}/package.json" && -d "${dir}/.git" ]]; then
      printf '%s' "${dir}"
      return 0
    fi
    dir="$(dirname "${dir}")"
  done

  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
  dir="${script_dir}"
  while [[ "${dir}" != "/" ]]; do
    if [[ -f "${dir}/MODULE.bazel" && -f "${dir}/package.json" && -d "${dir}/.git" ]]; then
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
exec "$@"
