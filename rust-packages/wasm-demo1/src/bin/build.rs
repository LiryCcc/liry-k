use std::path::PathBuf;
use std::process::Command;

fn cargo_tools() -> PathBuf {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    manifest_dir.join("target").join(".cargo-tools")
}

fn wasm_pack() -> PathBuf {
    let mut path = cargo_tools().join("bin").join("wasm-pack");
    if cfg!(windows) {
        path.set_extension("exe");
    }
    path
}

fn ensure_wasm32_target() {
    let status = Command::new("rustup")
        .args(["target", "add", "wasm32-unknown-unknown"])
        .status()
        .expect("failed to run rustup");
    if !status.success() {
        // target likely already installed; ignore
    }
}

fn ensure_wasm_pack() {
    let bin = wasm_pack();
    if !bin.exists() {
        println!("installing wasm-pack locally...");
        let status = Command::new("cargo")
            .args([
                "install",
                "wasm-pack",
                "--root",
                &cargo_tools().to_string_lossy(),
                "--quiet",
            ])
            .status()
            .expect("failed to install wasm-pack");
        assert!(status.success(), "wasm-pack installation failed");
    }
}

fn run_wasm_pack() {
    let bin = wasm_pack();
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let status = Command::new(&bin)
        .args([
            "build",
            ".",
            "--target",
            "web",
            "--scope",
            "liry-k",
            "--out-dir",
            "target/wasm-pkg",
            "--no-opt",
        ])
        .current_dir(&manifest_dir)
        .status()
        .expect("failed to run wasm-pack");
    assert!(status.success(), "wasm-pack build failed");
}

fn main() {
    ensure_wasm32_target();
    ensure_wasm_pack();
    run_wasm_pack();
}
