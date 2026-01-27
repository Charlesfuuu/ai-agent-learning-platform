# Ollama 安装指南 (macOS)

## 快速安装

### 方法 1: 手动下载（推荐）
1. 访问: https://ollama.com/download
2. 点击 "Download for macOS"
3. 下载完成后打开 .dmg 文件
4. 将 Ollama 拖到 Applications 文件夹
5. 打开 Ollama 应用

### 方法 2: 使用命令行下载
```bash
# 下载 Ollama macOS 版本
curl -L https://ollama.com/download/Ollama-darwin.zip -o ~/Downloads/Ollama.zip

# 解压并安装
unzip ~/Downloads/Ollama.zip -d ~/Downloads/
open ~/Downloads/Ollama.app
```

## 安装后验证

打开新的终端窗口，运行：
```bash
ollama --version
```

## 拉取推荐模型

安装完成后，拉取一个中文友好的模型：

### 推荐模型选择：

**1. Qwen2.5 (7B) - 阿里通义千问（推荐）**
- 优点：中文能力强，速度快，内存占用适中
- 大小：约 4.7GB
```bash
ollama pull qwen2.5:7b
```

**2. Llama 3.2 (3B) - Meta（轻量级）**
- 优点：最轻量，启动快
- 大小：约 2GB
```bash
ollama pull llama3.2:3b
```

**3. DeepSeek-R1 (7B) - 国产推理模型**
- 优点：推理能力强，适合代码
- 大小：约 4.7GB
```bash
ollama pull deepseek-r1:7b
```

## 启动 Ollama 服务

安装并拉取模型后，Ollama 会自动在后台运行在 `http://localhost:11434`

验证服务是否运行：
```bash
curl http://localhost:11434
```

应该返回：`Ollama is running`

## 测试模型

```bash
ollama run qwen2.5:7b "你好，请介绍一下你自己"
```

---

## 安装完成后

请在终端执行以下命令告诉我：
```bash
ollama --version
ollama list
```
