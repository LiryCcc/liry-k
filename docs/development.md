# 开发环境搭建

## 环境总览

本仓库是一个多语言 monorepo，包含以下技术栈：

| 技术栈               | 用途                       | 涉及目录                                        |
| -------------------- | -------------------------- | ----------------------------------------------- |
| Node.js / TypeScript | 前端应用、工具库、基础设施 | `packages/`、`infra/`                           |
| Rust                 | 桌面应用（Tauri）、算法包  | `packages/polaris/src-tauri/`、`rust-packages/` |
| Java                 | Minecraft 插件             | `mc-plugins/`                                   |

---

## 一、Node.js 环境

### 版本要求

- **Node.js** `>= 24`
- **pnpm** `>= 10`

### 安装 Node.js

推荐使用 [fnm](https://github.com/Schniz/fnm) 或 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本：

```bash
# 使用 fnm（推荐）
fnm install 24
fnm use 24
```

### 安装 pnpm

```bash
npm install -g pnpm
```

### 安装项目依赖

在仓库根目录执行：

```bash
pnpm install
```

`pnpm install` 完成后会自动触发 `postinstall`，执行根目录及各包的 `build` 脚本，构建产物（含 `infra/proto` 的 protobuf 代码生成）。

---

## 二、Rust 环境

### 版本要求

通过根目录 `rust-toolchain.toml`（若存在）或系统 rustup 默认工具链管理。

### 安装 Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后重启终端，验证：

```bash
rustc --version
cargo --version
```

### Tauri 系统依赖

`packages/polaris` 是基于 [Tauri v2](https://v2.tauri.app/) 的桌面应用，构建前需按平台安装系统依赖。

**Linux（Ubuntu / Debian）：**

```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**macOS：**

需要安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

**Windows：**

需要安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（勾选「Desktop development with C++」），以及 [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)（Windows 10/11 通常已内置）。

### 预拉取 Rust 依赖（可选）

```bash
cargo fetch
```

---

## 三、Java 环境

### 版本要求

- **Java** `21`（由 Gradle toolchain 自动管理，本地需有 JDK 21 或让 Gradle 自动下载）

### 安装 JDK

推荐使用 [SDKMAN](https://sdkman.io/) 管理 JDK 版本：

```bash
sdk install java 21-tem
```

或直接从 [Adoptium](https://adoptium.net/) 下载安装包。

### 安装 Gradle 依赖

`mc-plugins` 使用 Gradle Wrapper，无需单独安装 Gradle：

```bash
./gradlew dependencies
```

---

## 四、其他工具

### protoc（Protocol Buffers 编译器）

`infra/proto` 包使用 protobuf 生成 TypeScript 代码。`protoc` 已通过 npm 包 `protoc` 内置于 `node_modules`，执行 `pnpm install` 后无需额外安装。

---

## 五、Git Hooks 配置

依赖安装完成后，`simple-git-hooks` 会自动在 `pnpm install` 的 `prepare` 阶段注册 hooks。若需手动激活：

```bash
pnpm prepare
```

注册后，每次 `git commit` 前会自动运行 `pnpm pre-commit` 进行格式、拼写、lint 检查。

---

## 六、常用开发命令

### 全局命令（根目录）

| 命令                | 说明                                   |
| ------------------- | -------------------------------------- |
| `pnpm install`      | 安装所有依赖并构建                     |
| `pnpm build`        | 构建所有包                             |
| `pnpm format`       | 格式化所有代码                         |
| `pnpm pre-commit`   | 运行完整检查（格式、拼写、lint、Rust） |
| `pnpm lint:rust`    | 运行 cargo clippy                      |
| `pnpm lint:rustfmt` | 检查 Rust 代码格式                     |

### 单包命令

```bash
# 前端开发服务器（luna）
pnpm --filter @liry-k/luna dev

# 构建单个包
pnpm --filter @liry-k/luna build

# 单包 lint
pnpm --filter @liry-k/luna lint

# Tauri 桌面应用开发（polaris）
pnpm --filter @liry-k/polaris tauri dev
```

### Java 插件

```bash
# 构建 mc-plugins
./gradlew build
```
