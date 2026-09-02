#!/usr/bin/env bash
set -euo pipefail

pkg_rel="${1:?package path relative to workspace root}"

resolve_workspace_root() {
  if [[ -n "${BUILD_WORKSPACE_DIRECTORY:-}" ]]; then
    printf '%s\n' "${BUILD_WORKSPACE_DIRECTORY}"
    return
  fi

  local dir="${PWD}"
  while [[ "${dir}" != "/" ]]; do
    if [[ -f "${dir}/MODULE.bazel" || -f "${dir}/WORKSPACE" || -f "${dir}/WORKSPACE.bazel" ]]; then
      printf '%s\n' "${dir}"
      return
    fi
    dir="$(dirname "${dir}")"
  done

  if [[ -d "${PWD}/_main" && -f "${PWD}/_main/MODULE.bazel" ]]; then
    (
      cd "${PWD}/_main"
      pwd -P
    )
    return
  fi

  echo "npm-package-test: could not resolve workspace root" >&2
  exit 1
}

root="$(resolve_workspace_root)"

cd "${root}/${pkg_rel}"
pnpm run test
