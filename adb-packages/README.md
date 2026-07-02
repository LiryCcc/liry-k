# ADB Libraries

本目录为 [Tango](https://github.com/yume-chan/ya-webadb)（原 `@yume-chan/*` 系列包）的子集，基于 [MIT](https://github.com/yume-chan/ya-webadb/blob/main/LICENSE) 协议引入，作者 Simon Chan。

Tango 是 **Android Debug Bridge (ADB) 协议** 的 TypeScript 实现，支持浏览器（Chromium）、Node.js 及 Electron 环境。

## 协议来源

ADB 协议由 Android Open Source Project (AOSP) 定义，核心规范参见：

- [Android ADB 协议文档](https://android.googlesource.com/platform/packages/modules/adb/+/refs/heads/main/protocol.txt)
- [AOSP adb 源码](https://android.googlesource.com/platform/packages/modules/adb/)
- `OVERVIEW.TXT` — 协议总览
- `SYNC.TXT` — sync 服务协议

本目录中所有 ADB 协议相关实现均基于上述公开文档。

## 包列表

| 包名                            | 说明                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `@yume-chan/adb`                | ADB 协议核心：连接管理、认证（RSA）、数据包解析、Shell/Subprocess/Sync 服务       |
| `@yume-chan/adb-daemon-webusb`  | ADB Daemon 的 WebUSB 传输层，支持浏览器直连 Android 设备                          |
| `@yume-chan/adb-credential-web` | 浏览器端 ADB 密钥存储（IndexedDB + 密码加密 / WebAuthn PRF）                      |
| `@yume-chan/android-bin`        | Android 命令行工具封装（`am`, `pm`, `bugreport`, `dumpsys`, 等）                  |
| `@yume-chan/stream-extra`       | Web Streams API 扩展工具（PushReadableStream, Consumable, DistributionStream 等） |
| `@yume-chan/struct`             | C 风格结构体序列化/反序列化库                                                     |
| `@yume-chan/event`              | 事件系统（EventEmitter, StickyEvent, AutoDisposable）                             |
| `@yume-chan/no-data-view`       | 避免创建 `DataView` 的二进制数据读写方法                                          |

## 许可

```
MIT License

Copyright (c) 2021 Simon Chan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
