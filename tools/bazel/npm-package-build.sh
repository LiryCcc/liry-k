#!/usr/bin/env bash
# Build an npm workspace package from the real workspace root, then copy dist/
# into Bazel's output tree so action results can be cached.
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

  echo "npm-package-build: could not resolve workspace root (set BUILD_WORKSPACE_DIRECTORY)" >&2
  exit 1
}

resolve_working_directory() {
  if [[ -n "${BUILD_WORKING_DIRECTORY:-}" ]]; then
    printf '%s\n' "${BUILD_WORKING_DIRECTORY}"
    return
  fi

  printf '%s\n' "${PWD}"
}

root="$(resolve_workspace_root)"
work="$(resolve_working_directory)"

cd "${root}/${pkg_rel}"
pnpm run build

if [[ -d dist ]]; then
  mkdir -p "${work}/dist"
  rsync -a dist/ "${work}/dist/"
else
  mkdir -p "${work}/dist"
  touch "${work}/dist/.keep"
fi
