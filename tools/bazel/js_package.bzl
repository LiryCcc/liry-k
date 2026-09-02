"""Per-package npm build targets with declared inputs/outputs for Bazel caching."""

load("@aspect_bazel_lib//lib:run_binary.bzl", "run_binary")

_JS_PACKAGE_EXCLUDES = [
    "node_modules/**",
    "dist/**",
    "bazel-*/**",
    "BUILD.bazel",
]

def js_npm_package(
        name = "pkg",
        package_path = None,
        deps = [],
        tags = []):
    """Run `pnpm run build` with Bazel-tracked sources and dist/ outputs."""
    pkg = package_path if package_path != None else native.package_name()

    native.filegroup(
        name = name + "_srcs",
        srcs = native.glob(
            ["**"],
            exclude = _JS_PACKAGE_EXCLUDES,
            allow_empty = True,
        ),
    )

    run_binary(
        name = "build",
        tool = "//tools/bazel:npm_package_build",
        args = [pkg],
        srcs = [":" + name + "_srcs"] + deps,
        out_dirs = ["dist"],
        visibility = ["//visibility:public"],
        tags = tags + [
            "local",
            "no-sandbox",
            "requires-network",
        ],
        mnemonic = "JsNpmBuild",
        use_default_shell_env = True,
    )

    native.alias(
        name = name,
        actual = ":build",
    )

def js_npm_test(
        name = "pkg",
        package_path = None,
        deps = [],
        tags = []):
    """Run `pnpm run test` as a Bazel test target."""
    pkg = package_path if package_path != None else native.package_name()

    native.filegroup(
        name = name + "_srcs",
        srcs = native.glob(
            ["**"],
            exclude = _JS_PACKAGE_EXCLUDES,
            allow_empty = True,
        ),
    )

    native.sh_test(
        name = "test",
        srcs = ["//tools/bazel:npm-package-test.sh"],
        args = [pkg],
        data = [":" + name + "_srcs"] + deps,
        visibility = ["//visibility:public"],
        tags = tags + [
            "local",
            "no-sandbox",
            "requires-network",
        ],
    )

    native.alias(
        name = name,
        actual = ":test",
    )
