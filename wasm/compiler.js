/**
 * C++ 到 WASM 编译器模拟器
 * 
 * 在真实环境中，此文件应由 Emscripten 生成
 * 这里提供一个简化的接口层
 */

// 虚拟文件系统
class VirtualFS {
    constructor() {
        this.files = {};
    }
    
    writeFile(path, content) {
        this.files[path] = typeof content === 'string' 
            ? new TextEncoder().encode(content)
            : content;
    }
    
    readFile(path) {
        return this.files[path] || null;
    }
    
    removeFile(path) {
        delete this.files[path];
    }
    
    listFiles() {
        return Object.keys(this.files);
    }
}

// 编译器实例
class ClangWASM {
    constructor() {
        this.FS = new VirtualFS();
        this.stdout = '';
        this.stderr = '';
        this.exitCode = 0;
    }
    
    /**
     * 编译 C++ 代码
     * @param {string} sourceCode - C++ 源代码
     * @param {Object} options - 编译选项
     * @returns {Promise<Object>} 编译结果
     */
    async compile(sourceCode, options = {}) {
        this.stdout = '';
        this.stderr = '';
        
        const {
            optimize = false,
            warn = true,
            outputPath = '/a.wasm'
        } = options;
        
        // 写入源代码
        this.FS.writeFile('/source.cpp', sourceCode);
        
        // 模拟编译过程
        await this._simulateCompilation(sourceCode, options);
        
        if (this.exitCode === 0) {
            // 生成模拟的 WASM 二进制
            const wasmBinary = this._generateWasmBinary(sourceCode);
            this.FS.writeFile(outputPath, wasmBinary);
            
            return {
                success: true,
                output: this.stdout,
                wasmBinary: wasmBinary,
                exitCode: 0
            };
        } else {
            return {
                success: false,
                error: this.stderr,
                exitCode: this.exitCode
            };
        }
    }
    
    /**
     * 运行编译后的 WASM
     */
    async run(wasmBinary, stdin = '') {
        // 模拟运行
        const inputLines = stdin.trim().split('\n');
        let inputIndex = 0;
        
        // 解析源代码中的 cout 语句
        const capturedOutput = this._simulateExecution(wasmBinary, stdin);
        
        return {
            output: capturedOutput,
            exitCode: 0
        };
    }
    
    // 内部方法：模拟编译
    async _simulateCompilation(code, options) {
        // 模拟编译延迟
        await new Promise(r => setTimeout(r, 300 + Math.random() * 700));
        
        const errors = [];
        const warnings = [];
        
        // 检查 #include
        if (!code.includes('#include')) {
            warnings.push('警告: 未包含任何头文件');
        }
        
        // 检查 main 函数
        if (!code.includes('int main(') && !code.includes('int main ()')) {
            errors.push('错误: 未定义 \'int main()\' 函数');
        }
        
        // 检查花括号
        let braceCount = 0;
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (const ch of line) {
                if (ch === '{') braceCount++;
                if (ch === '}') braceCount--;
                if (braceCount < 0) {
                    errors.push(`错误: 第 ${i + 1} 行: 花括号不匹配（多余的 }）`);
                    braceCount = 0;
                    break;
                }
            }
        }
        if (braceCount > 0) {
            errors.push('错误: 花括号不匹配（缺少 }）');
        }
        
        // 检查分号（简化）
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
                !line.includes('class ') &&
                !line.includes('struct ') &&
                line !== '') {
                warnings.push(`警告: 第 ${i + 1} 行可能有语法问题（缺少分号？）`);
            }
        }
        
        // 设置结果
        if (errors.length > 0) {
            this.stderr = errors.join('\n');
            if (warnings.length > 0) {
                this.stderr += '\n' + warnings.join('\n');
            }
            this.exitCode = 1;
        } else {
            this.stdout = '✅ 编译成功';
            if (options.optimize) this.stdout += ' (-O2)';
            if (options.warn) this.stdout += ' (-Wall)';
            if (warnings.length > 0) {
                this.stdout += '\n' + warnings.join('\n');
            }
            this.exitCode = 0;
        }
    }
    
    // 内部方法：生成模拟 WASM
    _generateWasmBinary(sourceCode) {
        // 生成简化的 WASM 模块
        // 真实场景中，这里应该是 clang 输出的真实 WASM
        const wasmHeader = [0x00, 0x61, 0x73, 0x6d]; // '\0asm'
        const version = [0x01, 0x00, 0x00, 0x00];     // version 1
        
        // 添加自定义段（包含源码哈希）
        const encoder = new TextEncoder();
        const sourceBytes = encoder.encode(sourceCode);
        const hash = this._simpleHash(sourceBytes);
        
        return new Uint8Array([
            ...wasmHeader,
            ...version,
            ...hash.slice(0, 16)  // 嵌入源码哈希
        ]);
    }
    
    // 内部方法：模拟执行
    _simulateExecution(wasmBinary, stdin) {
        // 从虚拟文件系统中读取源代码
        const sourceCode = new TextDecoder().decode(this.FS.readFile('/source.cpp') || new Uint8Array());
        
        // 解析 cout 语句
        const outputs = [];
        const coutRegex = /cout\s*<<\s*"([^"]*(?:\\n[^"]*)*)"/g;
        let match;
        
        while ((match = coutRegex.exec(sourceCode)) !== null) {
            let str = match[1];
            // 处理转义字符
            str = str.replace(/\\n/g, '\n')
                     .replace(/\\t/g, '\t')
                     .replace(/\\\\/g, '\\')
                     .replace(/\\"/g, '"');
            outputs.push(str);
        }
        
        // 处理 endl
        const endlRegex = /cout\s*<<\s*endl/g;
        let lastIndex = 0;
        let result = '';
        let outputIdx = 0;
        
        // 更精确的输出模拟
        const fullOutputRegex = /cout\s*<<\s*(?:"([^"]*)"|endl|flush|(\w+))/g;
        let token;
        let finalOutput = '';
        
        while ((token = fullOutputRegex.exec(sourceCode)) !== null) {
            if (token[1] !== undefined) {
                let str = token[1];
                str = str.replace(/\\n/g, '\n')
                         .replace(/\\t/g, '\t');
                finalOutput += str;
            } else if (token[0].includes('endl')) {
                finalOutput += '\n';
            }
        }
        
        // 如果有 cin，尝试注入输入
        if (sourceCode.includes('cin >>')) {
            const inputs = stdin.trim().split(/\s+/);
            let inputIdx = 0;
            
            // 查找变量输出
            const varOutputRegex = /cout\s*<<\s*(\w+)\s*(?:\s*<<\s*(?:"([^"]*)"|endl|(\w+)))*/g;
            let varMatch;
            let varOutput = '';
            
            while ((varMatch = varOutputRegex.exec(sourceCode)) !== null) {
                for (let i = 1; i < varMatch.length; i++) {
                    if (varMatch[i] !== undefined) {
                        if (i === 1 || (i > 1 && varMatch[i] !== 'endl')) {
                            if (varMatch[i].startsWith('"')) continue;
                            // 这是变量名，从输入中获取
                            if (inputIdx < inputs.length) {
                                varOutput += inputs[inputIdx++];
                            }
                        }
                    }
                }
            }
            
            if (varOutput) {
                finalOutput = finalOutput.replace(/\[变量\]/g, () => 
                    inputIdx < inputs.length ? inputs[inputIdx++] : ''
                );
            }
        }
        
        return finalOutput || '（程序执行完毕，无输出）';
    }
    
    _simpleHash(bytes) {
        let hash = 0;
        for (let i = 0; i < bytes.length; i++) {
            hash = ((hash << 5) - hash + bytes[i]) | 0;
        }
        // 转为 16 字节
        const result = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            result[i] = (hash >> (i * 8)) & 0xFF;
        }
        return result;
    }
    
    getStdout() { return this.stdout; }
    getStderr() { return this.stderr; }
}

// 导出
window.ClangWASM = ClangWASM;
