# 🚀 快速开始指南

## 1. 启动项目

```bash
# 方法1：Python（推荐）
cd cpp-compiler-wasm
python3 -m http.server 8080

# 方法2：Node.js
npx serve .

# 方法3：PHP
php -S localhost:8080
```

打开浏览器访问：`http://localhost:8080`

## 2. 使用说明

### 编写代码
- 左侧编辑器编写 C++ 代码
- 支持多文件 Tab 切换（main.cpp / utils.cpp / header.h）
- 支持代码模板快速开始

### 输入数据
- 左下角 stdin 区域输入数据
- 勾选「自动填充」后，程序运行时会自动使用这些数据
- 支持多行输入

### 编译运行
- 点击「编译并运行」按钮，或按 `Ctrl+Enter`
- 右侧查看编译日志和运行结果
- 支持三个输出 Tab：编译日志 / 运行结果 / 全部输出

### 编译选项
- **-O2 优化**：启用代码优化
- **-Wall**：显示所有警告

### 快捷键
| 快捷键 | 功能 |
|--------|------|
| Ctrl+Enter | 编译并运行 |
| Tab | 缩进 |
| Esc | 退出全屏 |

## 3. 示例输入

### 示例1：简单计算
**代码：**
```cpp
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << a + b << endl;
    return 0;
}
```

**输入：**
```
10 20
```

### 示例2：数组处理
**代码：**
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    sort(arr.begin(), arr.end());
    for (int x : arr) cout << x << " ";
    return 0;
}
```

**输入：**
```
5
3 1 4 1 5
```

## 4. 集成真实 WASM 编译器

### 方法 A：使用 Emscripten

```bash
# 1. 安装 Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

# 2. 编译 clang 到 WASM（高级用法）
# 或使用预编译的运行时

# 3. 替换 app.js 中的 compileCpp 函数
```

### 方法 B：使用 WebAssembly Micro Runtime (WAMR)

```bash
# 使用 WAMR 作为 WASM 运行时
git clone https://github.com/bytecodealliance/wasm-micro-runtime.git
cd wasm-micro-runtime
mkdir build && cd build
cmake .. && make
```

### 方法 C：使用现成服务（最简单）

替换 `compileCpp` 函数，调用在线 API：

```javascript
async function compileCpp(code, options) {
    const response = await fetch('https://your-compiler-api.com/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, options })
    });
    return response.json();
}
```

## 5. 项目结构

```
cpp-compiler-wasm/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 前端逻辑（含模拟编译器）
├── README.md           # 项目说明
├── QUICKSTART.md       # 快速开始（本文件）
└── wasm/
    └── compiler.js     # WASM 编译器模拟器
```

## 6. 浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|--------|----------|------|
| Chrome | 57+ | ✅ 完全支持 |
| Firefox | 52+ | ✅ 完全支持 |
| Safari | 11+ | ✅ 完全支持 |
| Edge | 16+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

## 7. 常见问题

**Q: 为什么显示"编译器尚未就绪"？**
A: 等待加载动画完成即可，首次加载需要下载 WASM 模块。

**Q: 代码中的 cin 如何接收输入？**
A: 在左下角 stdin 区域输入数据，程序运行时会自动注入。

**Q: 如何保存代码？**
A: 代码会自动保存到浏览器 LocalStorage，刷新页面不会丢失。

**Q: 支持哪些 C++ 特性？**
A: 模拟器支持基本语法检查。接入真实 WASM 编译器后支持完整 C++17/20。
