# 开发环境搭建

## 环境总览

本仓库是一个多语言 monorepo，包含以下技术栈。任务编排由 **Nx** 负责（`nx run-many` / `nx affected`）；Node、JDK、Gradle 版本仍由本机 / CI / Gradle Wrapper 与 toolchain 钉死，Nx 不加载工具链。

| 技术栈               | 用途                       | 涉及目录                                    |
| -------------------- | -------------------------- | ------------------------------------------- |
| Node.js / TypeScript | 前端应用、工具库、基础设施 | `apps/`、`packages/`、`infra/`、`demos/`    |
| Rust                 | 桌面应用（Tauri）、算法包  | `apps/polaris/src-tauri/`、`rust-packages/` |
| Java                 | Minecraft 插件             | `mc-plugins/`                               |

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

`apps/polaris`（`@liry-k/polaris`）是基于 [Tauri v2](https://v2.tauri.app/) 的桌面应用，构建前需按平台安装系统依赖。

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

| 命令                | 说明                                               |
| ------------------- | -------------------------------------------------- |
| `pnpm install`      | 安装所有依赖并通过 Nx 构建 TypeScript 包           |
| `pnpm build`        | `pnpm nx run-many -t build`（不含 Rust / Java）    |
| `pnpm format`       | 格式化所有代码                                     |
| `pnpm pre-commit`   | 运行完整检查（格式、拼写、TS/Rust lint）           |
| `pnpm lint:rust`    | 各 crate clippy                                    |
| `pnpm lint:rustfmt` | 检查 Rust 代码格式                                 |
| `pnpm nx …`         | 经 `scripts/nx.mjs` 调用 Nx（自动加载根 `nx.env`） |

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
# 构建 mc-plugins（Gradle / Nx 均可）
./gradlew build
pnpm nx run-many -t build --projects=tag:lang:java
```

---

## 七、调试页面

`adb-web-new` 包包含一个隐藏的调试页面，用于查看运行时状态、环境信息和依赖版本。

### 打开方式

1. **点击标题**：在 `adb-web-new` 页面顶部，**连续点击标题「ADB Web」7 次**，会弹出 TOTP 验证对话框
2. **TOTP 验证**：输入与当前构建匹配的 TOTP 验证码（6 位数字），验证通过后自动跳转到 `/debug` 页面

### 验证码获取

TOTP 种子在每次构建时随机生成，可通过以下方式获取当前验证码：

- 查看构建日志中 `__TOTP_SECRET__` 的值，使用 TOTP 工具（如 `oathtool`）生成：
  ```bash
  oathtool --totp -b <secret-hex>
  ```
- 或结合 `jq` 从构建产物中提取（需访问源码构建环境）

### 路由守卫

直接访问 `/debug` URL 会被 `beforeLoad` 路由守卫拦截并重定向到首页。

### 调试页面包含

| 板块         | 内容                                                    |
| ------------ | ------------------------------------------------------- |
| Environment  | User Agent、Platform、Language、URL、CPU 核心数、Cookie |
| Screen       | 分辨率、devicePixelRatio、色深、屏幕方向                |
| Network      | 在线状态、网络类型、下行速度、RTT                       |
| Capabilities | WebUSB、WebSerial、WebBluetooth、WebHID、WebMIDI 等     |
| Storage      | localStorage 键数量、大小、Cache Storage 名称列表       |
| Theme        | 当前主题                                                |
| ADB Device   | ADB 连接状态、当前设备、设备数量                        |
