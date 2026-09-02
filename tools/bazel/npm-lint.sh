#!/usr/bin/env bash
set -euo pipefail

resolve_workspace_root() {
  if [[ -n "${BUILD_WORKSPACE_DIRECTORY:-}" ]]; then
    printf '%s\n' "${BUILD_WORKSPACE_DIRECTORY}"
    return
  fi

  local dir="${PWD}"
  while [[ "${dir}" != "/" ]]; do
    if [[ -f "${dir}/MODULE.bazel" && -f "${dir}/package.json" && -d "${dir}/.git" ]]; then
      printf '%s\n' "${dir}"
      return
    fi
    dir="$(dirname "${dir}")"
  done

  echo "npm-lint: could not resolve workspace root" >&2
  exit 1
}

root="$(resolve_workspace_root)"
cd "${root}"

# Avoid pnpm reinstalling (and re-running postinstall/bazel) inside Bazel actions.
pnpm --config.verify-deps-before-run=false -r --parallel lint
