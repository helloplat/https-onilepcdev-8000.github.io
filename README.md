# C++ 在线编译器（纯前端 WebAssembly）

一个完全在浏览器端运行的 C++ 编译器，基于 WebAssembly + Emscripten。

## 功能特性

- ✅ 浏览器端编译 C++（无需后端）
- ✅ 自定义 stdin 输入，自动填充
- ✅ 完整编译日志 & 运行结果
- ✅ 多文件 Tab 支持
- ✅ 代码模板（基础/输入/数组/类/算法）
- ✅ 深色/浅色主题切换
- ✅ 编译优化选项（-O2 / -Wall）
- ✅ 全屏模式
- ✅ 键盘快捷键（Ctrl+Enter 编译）

## 快速开始

1. 下载 clang.js 和 clang.wasm（见下方）
2. 解压到 `wasm/` 目录
3. 用任意 HTTP 服务器启动：

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

4. 打开浏览器访问 `http://localhost:8080`

## WASM 编译器下载

由于 WASM 文件较大，请从以下链接下载并放入 `wasm/` 目录：

- **方案 A：使用 Emscripten 官方 clang**
  ```bash
  # 安装 Emscripten SDK
  git clone https://github.com/emscripten-core/emsdk.git
  cd emsdk
  ./emsdk install latest
  ./emsdk activate latest
  source ./emsdk_env.sh
  
  # 编译 clang 到 WASM（简化版，实际需自行构建）
  ```

- **方案 B：使用现成的在线服务**
  - 使用 [Wasmexplorer](https://wasmer.io/) 的运行时
  - 或使用 [CodeSandbox](https://codesandbox.io/) 的容器方案

## 项目结构

```
cpp-compiler-wasm/
├── index.html          # 主页面
├── style.css           # 样式
├── app.js              # 前端逻辑
├── README.md           # 说明文档
└── wasm/
    ├── clang.js        # WASM 编译器（需下载）
    └── clang.wasm      # WASM 二进制（需下载）
```

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- WebAssembly（编译目标）
- Emscripten（编译器工具链）
- CodeMirror / Monaco Editor（可选，已预留接口）

## 浏览器要求

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

## License

MIT
