/**
 * C++ 在线编译器 - 前端核心逻辑
 * 纯前端实现，支持代码编辑、编译、运行、输入注入
 */

// ==================== 代码模板 ====================
const TEMPLATES = {
    basic: `// 基础 C++ 程序
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++ Playground!" << endl;
    return 0;
}`,

    input: `// 输入示例 - 自动填充 stdin
#include <iostream>
#include <string>
using namespace std;

int main() {
    int a, b;
    string name;
    
    cout << "请输入两个整数: ";
    cin >> a >> b;
    
    cout << "请输入名字: ";
    cin >> name;
    
    cout << "\\n===== 结果 =====\\n";
    cout << "名字: " << name << endl;
    cout << "和: " << a + b << endl;
    cout << "积: " << a * b << endl;
    cout << "差: " << a - b << endl;
    
    return 0;
}`,

    array: `// 数组操作示例
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    int n;
    cout << "请输入数组大小: ";
    cin >> n;
    
    vector<int> arr(n);
    cout << "请输入 " << n << " 个数字:\\n";
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // 排序
    sort(arr.begin(), arr.end());
    
    cout << "\\n===== 结果 =====\\n";
    cout << "排序后的数组: ";
    for (int x : arr) {
        cout << x << " ";
    }
    cout << endl;
    
    // 求和
    int sum = 0;
    for (int x : arr) sum += x;
    cout << "总和: " << sum << endl;
    cout << "平均值: " << (double)sum / n << endl;
    cout << "最大值: " << *max_element(arr.begin(), arr.end()) << endl;
    cout << "最小值: " << *min_element(arr.begin(), arr.end()) << endl;
    
    return 0;
}`,

    class: `// 类与对象示例
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Student {
private:
    string name;
    int age;
    double grade;
    vector<int> scores;
    
public:
    Student(string n = "", int a = 0, double g = 0) 
        : name(n), age(a), grade(g) {}
    
    void input() {
        cout << "请输入姓名: ";
        cin >> name;
        cout << "请输入年龄: ";
        cin >> age;
        
        cout << "请输入3门课的成绩: ";
        scores.resize(3);
        for (int i = 0; i < 3; i++) {
            cin >> scores[i];
        }
        
        // 计算平均分
        double total = 0;
        for (int s : scores) total += s;
        grade = total / 3.0;
    }
    
    void display() const {
        cout << "\\n===== 学生信息 =====\\n";
        cout << "姓名: " << name << endl;
        cout << "年龄: " << age << endl;
        cout << "各科成绩: ";
        for (int s : scores) cout << s << " ";
        cout << endl;
        cout << "平均分: " << grade << endl;
        cout << "等级: " << getLevel() << endl;
    }
    
    string getLevel() const {
        if (grade >= 90) return "A (优秀)";
        if (grade >= 80) return "B (良好)";
        if (grade >= 70) return "C (中等)";
        if (grade >= 60) return "D (及格)";
        return "F (不及格)";
    }
};

int main() {
    Student stu;
    stu.input();
    stu.display();
    return 0;
}`,

    algorithm: `// 算法模板 - 排序与查找
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <stack>
#include <map>
#include <set>
using namespace std;

// 快速排序
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// 二分查找
int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int n, target;
    cout << "请输入数组大小: ";
    cin >> n;
    
    vector<int> arr(n);
    cout << "请输入 " << n << " 个整数:\\n";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << "请输入要查找的目标值: ";
    cin >> target;
    
    // 排序
    quickSort(arr, 0, n - 1);
    
    cout << "\\n===== 排序结果 =====\\n";
    cout << "排序后: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    // 查找
    int result = binarySearch(arr, target);
    if (result != -1) {
        cout << "找到目标值 " << target << " 在索引 " << result << " 处\\n";
    } else {
        cout << "未找到目标值 " << target << endl;
    }
    
    // 使用 STL
    cout << "\\n===== STL 算法 =====\\n";
    cout << "最小值: " << *min_element(arr.begin(), arr.end()) << endl;
    cout << "最大值: " << *max_element(arr.begin(), arr.end()) << endl;
    cout << "元素个数: " << arr.size() << endl;
    
    return 0;
}`
};

// ==================== 多文件管理 ====================
const FILES = {
    "main.cpp": TEMPLATES.basic,
    "utils.cpp": `// 工具函数
#include <iostream>
#include "header.h"
using namespace std;

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int findMax(int arr[], int size) {
    int maxVal = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    return maxVal;
}`,
    "header.h": `#ifndef HEADER_H
#define HEADER_H

void printArray(int arr[], int size);
int findMax(int arr[], int size);

#endif // HEADER_H`
};

// ==================== 应用状态 ====================
const state = {
    currentFile: 'main.cpp',
    files: { ...FILES },
    isCompiling: false,
    isDarkTheme: true,
    wasmReady: false,
    compileStartTime: 0,
    runStartTime: 0,
};

// ==================== DOM 元素 ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const elements = {
    codeEditor: $('#codeEditor'),
    stdinInput: $('#stdinInput'),
    lineNumbers: $('#lineNumbers'),
    compileBtn: $('#compileBtn'),
    clearAllBtn: $('#clearAllBtn'),
    clearInput: $('#clearInput'),
    templateSelect: $('#templateSelect'),
    themeToggle: $('#themeToggle'),
    fullscreenBtn: $('#fullscreenBtn'),
    statusDot: $('#statusDot'),
    statusText: $('#statusText'),
    compileTime: $('#compileTime'),
    runTime: $('#runTime'),
    compileLog: $('#compileLog'),
    runOutput: $('#runOutput'),
    allOutput: $('#allOutput'),
    loadingOverlay: $('#loadingOverlay'),
    loadingSubtext: $('#loadingSubtext'),
    autoFillInput: $('#autoFillInput'),
    optimizeLevel: $('#optimizeLevel'),
    warnLevel: $('#warnLevel'),
};

// ==================== 初始化 ====================
function init() {
    loadState();
    setupEventListeners();
    updateLineNumbers();
    loadFile(state.currentFile);
    initTheme();
    
    // 模拟 WASM 加载（实际项目中替换为真实 WASM 初始化）
    simulateWasmLoad();
}

function simulateWasmLoad() {
    // 模拟加载进度
    const messages = [
        '正在加载 WebAssembly 模块...',
        '正在初始化编译器...',
        '正在加载标准库...',
        '准备就绪！'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < messages.length - 1) {
            elements.loadingSubtext.textContent = messages[i];
            i++;
        } else {
            clearInterval(interval);
            state.wasmReady = true;
            elements.loadingOverlay.classList.add('hidden');
            elements.statusText.textContent = '编译器就绪';
            setTimeout(() => {
                elements.loadingOverlay.style.display = 'none';
            }, 500);
        }
    }, 800);
}

// ==================== 事件监听 ====================
function setupEventListeners() {
    // 编辑器事件
    elements.codeEditor.addEventListener('input', () => {
        state.files[state.currentFile] = elements.codeEditor.value;
        updateLineNumbers();
        saveState();
    });

    elements.codeEditor.addEventListener('scroll', syncScroll);
    elements.codeEditor.addEventListener('keydown', handleEditorKeys);

    // 输入区域
    elements.stdinInput.addEventListener('input', saveState);
    elements.clearInput.addEventListener('click', () => {
        elements.stdinInput.value = '';
        saveState();
    });

    // Tab 切换
    $$('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchFile(tab.dataset.file));
    });

    // 输出 Tab 切换
    $$('.output-tab').forEach(tab => {
        tab.addEventListener('click', () => switchOutputTab(tab.dataset.tab));
    });

    // 编译按钮
    elements.compileBtn.addEventListener('click', compileAndRun);

    // 清空按钮
    elements.clearAllBtn.addEventListener('click', () => {
        elements.compileLog.textContent = '已清空';
        elements.runOutput.textContent = '已清空';
        elements.allOutput.textContent = '已清空';
        elements.compileTime.textContent = '';
        elements.runTime.textContent = '';
        elements.statusText.textContent = '就绪';
        elements.statusDot.className = 'status-dot';
    });

    // 模板选择
    elements.templateSelect.addEventListener('change', (e) => {
        if (confirm('切换模板将替换当前代码，是否继续？')) {
            elements.codeEditor.value = TEMPLATES[e.target.value];
            state.files[state.currentFile] = elements.codeEditor.value;
            updateLineNumbers();
            saveState();
        }
        e.target.value = '';
    });

    // 主题切换
    elements.themeToggle.addEventListener('click', toggleTheme);

    // 全屏
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            compileAndRun();
        }
        if (e.key === 'Escape') {
            exitFullscreen();
        }
    });
}

// ==================== 编辑器功能 ====================
function updateLineNumbers() {
    const lines = elements.codeEditor.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
        html += i + '\n';
    }
    elements.lineNumbers.textContent = html;
}

function syncScroll() {
    elements.lineNumbers.scrollTop = elements.codeEditor.scrollTop;
}

function handleEditorKeys(e) {
    // Tab 键支持
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + '    ' + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + 4;
        state.files[state.currentFile] = e.target.value;
        updateLineNumbers();
    }
}

// ==================== 文件管理 ====================
function switchFile(filename) {
    // 保存当前文件
    state.files[state.currentFile] = elements.codeEditor.value;
    
    // 切换
    state.currentFile = filename;
    loadFile(filename);
    
    // 更新 Tab 状态
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.file === filename));
}

function loadFile(filename) {
    elements.codeEditor.value = state.files[filename] || '';
    updateLineNumbers();
}

// ==================== 输出面板 ====================
function switchOutputTab(tabName) {
    $$('.output-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    $$('.output-panel').forEach(p => p.classList.remove('active'));
    $(`#${tabName}Panel`).classList.add('active');
}

// ==================== 核心：编译与运行 ====================
async function compileAndRun() {
    if (state.isCompiling) return;
    if (!state.wasmReady) {
        showError('编译器尚未就绪，请稍候...');
        return;
    }

    state.isCompiling = true;
    elements.compileBtn.disabled = true;
    
    // 保存当前代码
    state.files[state.currentFile] = elements.codeEditor.value;
    
    // 获取输入
    const code = elements.codeEditor.value;
    const stdin = elements.stdinInput.value;
    const optimize = elements.optimizeLevel.checked;
    const warn = elements.warnLevel.checked;

    // 更新状态
    setStatus('compiling', '正在编译...');
    state.compileStartTime = performance.now();

    // 清空旧输出
    elements.compileLog.textContent = '';
    elements.runOutput.textContent = '';
    elements.allOutput.textContent = '';

    try {
        // ===== 第一步：编译 =====
        const compileResult = await compileCpp(code, { optimize, warn });
        
        const compileElapsed = ((performance.now() - state.compileStartTime) / 1000).toFixed(2);
        elements.compileTime.textContent = `编译: ${compileElapsed}s`;

        if (!compileResult.success) {
            // 编译失败
            const errorMsg = formatCompileError(compileResult.error);
            elements.compileLog.textContent = errorMsg;
            elements.compileLog.className = 'output-content error';
            elements.allOutput.textContent = errorMsg;
            elements.allOutput.className = 'output-content error';
            setStatus('error', '编译失败');
            return;
        }

        // 编译成功
        elements.compileLog.textContent = compileResult.output || '✅ 编译成功，无警告';
        elements.compileLog.className = 'output-content success';
        
        // ===== 第二步：运行 =====
        setStatus('compiling', '正在运行...');
        state.runStartTime = performance.now();
        
        const runResult = await runWasm(compileResult.wasmBinary, stdin);
        
        const runElapsed = ((performance.now() - state.runStartTime) / 1000).toFixed(2);
        elements.runTime.textContent = `运行: ${runElapsed}s`;

        if (runResult.timeout) {
            elements.runOutput.textContent = '⏰ 程序运行超时（超过 5 秒）';
            elements.runOutput.className = 'output-content error';
            setStatus('error', '运行超时');
        } else if (runResult.error) {
            elements.runOutput.textContent = `❌ 运行时错误:\n${runResult.error}`;
            elements.runOutput.className = 'output-content error';
            setStatus('error', '运行错误');
        } else {
            elements.runOutput.textContent = runResult.output || '（程序无输出）';
            elements.runOutput.className = 'output-content success';
            setStatus('success', '执行成功');
        }

        // 更新全部输出
        elements.allOutput.textContent = 
            `=== 编译日志 ===\n${elements.compileLog.textContent}\n\n` +
            `=== 运行结果 ===\n${elements.runOutput.textContent}`;
        elements.allOutput.className = 'output-content';

    } catch (err) {
        showError(`编译过程中发生错误: ${err.message}`);
    } finally {
        state.isCompiling = false;
        elements.compileBtn.disabled = false;
    }
}

// ==================== WASM 编译（模拟 + 真实实现） ====================

/**
 * 编译 C++ 代码
 * 实际项目中，这里应该调用真实的 WASM 编译器
 * 目前提供模拟版本和真实版本的接口
 */
async function compileCpp(code, options = {}) {
    // ===== 真实 WASM 编译实现（取消注释使用） =====
    /*
    try {
        // 方法1: 使用 Emscripten 编译的 clang
        const clang = await getClangInstance();
        
        // 将代码写入虚拟文件系统
        clang.FS.writeFile('/main.cpp', code);
        
        // 构建编译参数
        const args = ['-o', '/main.wasm', '/main.cpp'];
        if (options.optimize) args.splice(1, 0, '-O2');
        if (options.warn) args.splice(1, 0, '-Wall');
        
        // 执行编译
        const result = clang.ccall('main', 'number', 
            ['number', 'number'], 
            [args.length, 0]);
        
        if (result !== 0) {
            const stderr = clang.getStderr();
            return { success: false, error: stderr };
        }
        
        const wasmBinary = clang.FS.readFile('/main.wasm');
        return { success: true, output: clang.getStdout(), wasmBinary };
        
    } catch (e) {
        return { success: false, error: e.message };
    }
    */
    
    // ===== 模拟版本（演示用） =====
    return simulateCompile(code, options);
}

/**
 * 运行编译后的 WASM
 */
async function runWasm(wasmBinary, stdin) {
    // ===== 真实 WASM 运行实现 =====
    /*
    try {
        const module = await WebAssembly.instantiate(wasmBinary, {
            env: {
                // 注入 stdin
                __read_stdin: () => {
                    const input = stdin || '';
                    let pos = 0;
                    return () => {
                        if (pos >= input.length) return 0;
                        return input.charCodeAt(pos++);
                    };
                },
                // 捕获 stdout
                __write_stdout: (ptr, len) => {
                    // 从 WASM 内存读取输出
                }
            }
        });
        
        const instance = module.instance;
        const result = instance.exports.main();
        return { output: capturedOutput, exitCode: result };
    } catch (e) {
        return { error: e.message };
    }
    */
    
    // ===== 模拟版本 =====
    return simulateRun(wasmBinary, stdin);
}

// ==================== 模拟器（用于演示） ====================
function simulateCompile(code, options) {
    return new Promise((resolve) => {
        // 模拟编译延迟
        const delay = 500 + Math.random() * 1000;
        
        setTimeout(() => {
            // 基础语法检查
            const errors = [];
            
            // 检查基本语法
            if (!code.includes('#include')) {
                errors.push('警告: 未包含任何头文件');
            }
            
            if (!code.includes('int main()') && !code.includes('int main ()')) {
                errors.push('错误: 未找到 main 函数');
            }
            
            // 检查括号匹配
            let braceCount = 0;
            for (const ch of code) {
                if (ch === '{') braceCount++;
                if (ch === '}') braceCount--;
                if (braceCount < 0) {
                    errors.push('错误: 花括号不匹配（多余的 }）');
                    break;
                }
            }
            if (braceCount > 0) {
                errors.push('错误: 花括号不匹配（缺少 }）');
            }
            
            // 检查分号
            const lines = code.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.length > 0 && 
                    !line.endsWith(';') && 
                    !line.endsWith('{') && 
                    !line.endsWith('}') &&
                    !line.startsWith('//') &&
                    !line.startsWith('#') &&
                    !line.includes('main(') &&
                    !line.includes('int main') &&
                    !line.includes('void main') &&
                    line !== '') {
                    // 可能缺少分号，但不强制报错（可能是多行语句）
                }
            }
            
            if (errors.length > 0 && errors.some(e => e.includes('错误'))) {
                resolve({
                    success: false,
                    error: errors.join('\n')
                });
            } else {
                const output = errors.length > 0 
                    ? errors.filter(e => e.includes('警告')).join('\n')
                    : '✅ 编译成功' + (options.optimize ? ' (-O2)' : '') + (options.warn ? ' (-Wall)' : '');
                
                resolve({
                    success: true,
                    output: output,
                    wasmBinary: new Uint8Array([0x00, 0x61, 0x73, 0x6d]) // 模拟 WASM 头
                });
            }
        }, delay);
    });
}

function simulateRun(wasmBinary, stdin) {
    return new Promise((resolve) => {
        const delay = 200 + Math.random() * 800;
        
        setTimeout(() => {
            // 从代码中提取逻辑并模拟运行
            const code = elements.codeEditor.value;
            let output = '';
            
            try {
                // 解析代码中的 cout 语句
                const coutRegex = /cout\s*<<\s*(?:"([^"]*)"|(?:endl|flush))/g;
                let match;
                const outputs = [];
                
                while ((match = coutRegex.exec(code)) !== null) {
                    if (match[1] !== undefined) {
                        outputs.push(match[1]);
                    } else if (match[0].includes('endl')) {
                        outputs.push('\n');
                    }
                }
                
                // 如果有 cin，尝试从 stdin 读取
                if (code.includes('cin >>')) {
                    const inputs = stdin.trim().split(/\s+/);
                    let inputIdx = 0;
                    
                    // 替换输出中的变量引用（简化版）
                    const varRegex = /cout\s*<<\s*(?:"([^"]*)"|(\w+))\s*(?:\s*<<\s*(?:"([^"]*)"|(\w+)))*/g;
                    let varMatch;
                    while ((varMatch = varRegex.exec(code)) !== null) {
                        for (let i = 1; i < varMatch.length; i++) {
                            if (varMatch[i] !== undefined) {
                                if (varMatch[i].startsWith('"')) {
                                    output += varMatch[i].slice(1, -1);
                                } else {
                                    // 这是一个变量，尝试从输入中获取
                                    if (inputIdx < inputs.length) {
                                        output += inputs[inputIdx++];
                                    }
                                }
                            }
                        }
                    }
                } else {
                    output = outputs.join('');
                }
                
                // 如果没有捕获到输出，提供默认输出
                if (!output && outputs.length === 0) {
                    output = '（程序执行完毕，无输出）';
                }
                
                // 模拟超时
                if (code.includes('while(true)') || code.includes('for(;;)')) {
                    resolve({ timeout: true });
                    return;
                }
                
                resolve({ output: output || '程序执行完毕' });
                
            } catch (e) {
                resolve({ error: e.message });
            }
        }, delay);
    });
}

// ==================== 状态管理 ====================
function setStatus(type, text) {
    elements.statusText.textContent = text;
    elements.statusDot.className = 'status-dot ' + (type === 'error' ? 'error' : type === 'compiling' ? 'compiling' : '');
}

function showError(msg) {
    elements.compileLog.textContent = msg;
    elements.compileLog.className = 'output-content error';
    setStatus('error', '错误');
    state.isCompiling = false;
    elements.compileBtn.disabled = false;
}

// ==================== 主题 ====================
function initTheme() {
    const saved = localStorage.getItem('cpp-theme');
    if (saved === 'light') {
        state.isDarkTheme = false;
        document.documentElement.setAttribute('data-theme', 'light');
        elements.themeToggle.textContent = '☀️';
    }
}

function toggleTheme() {
    state.isDarkTheme = !state.isDarkTheme;
    if (state.isDarkTheme) {
        document.documentElement.removeAttribute('data-theme');
        elements.themeToggle.textContent = '🌙';
        localStorage.setItem('cpp-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.themeToggle.textContent = '☀️';
        localStorage.setItem('cpp-theme', 'light');
    }
}

// ==================== 全屏 ====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        elements.fullscreenBtn.textContent = '⛶';
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        elements.fullscreenBtn.textContent = '⛶';
    }
}

// ==================== 本地存储 ====================
function saveState() {
    try {
        localStorage.setItem('cpp-editor-files', JSON.stringify(state.files));
        localStorage.setItem('cpp-editor-current', state.currentFile);
        localStorage.setItem('cpp-editor-stdin', elements.stdinInput.value);
    } catch (e) {
        // localStorage 可能不可用
    }
}

function loadState() {
    try {
        const savedFiles = localStorage.getItem('cpp-editor-files');
        const savedCurrent = localStorage.getItem('cpp-editor-current');
        const savedStdin = localStorage.getItem('cpp-editor-stdin');
        
        if (savedFiles) {
            state.files = JSON.parse(savedFiles);
        }
        if (savedCurrent) {
            state.currentFile = savedCurrent;
        }
        if (savedStdin) {
            elements.stdinInput.value = savedStdin;
        }
    } catch (e) {
        // 忽略加载错误
    }
}

// ==================== 工具函数 ====================
function formatCompileError(error) {
    // 格式化编译错误，添加颜色标记
    return error
        .split('\n')
        .map(line => {
            if (line.includes('错误:') || line.includes('error:')) {
                return `❌ ${line}`;
            }
            if (line.includes('警告:') || line.includes('warning:')) {
                return `⚠️ ${line}`;
            }
            return line;
        })
        .join('\n');
}

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', init);
