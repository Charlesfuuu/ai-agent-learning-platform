# Ollama 快速安装指南（5 分钟搞定）

## 方法 1：一键安装（最快，推荐）

**步骤 1：访问官网下载**
打开浏览器，访问：
```
https://ollama.com/download/mac
```

点击"Download for macOS"按钮，自动下载会更快。

**步骤 2：安装**
1. 打开下载的 Ollama.app
2. 拖动到 Applications 文件夹
3. 双击打开 Ollama

**步骤 3：验证安装**
打开终端，运行：
```bash
ollama --version
```

看到版本号就说明安装成功了！

---

## 方法 2：使用 Homebrew（命令行）

如果你熟悉命令行，可以尝试：
```bash
brew install --cask ollama
```

注意：某些系统可能会报错，如果报错就用方法 1。

---

## 安装后：拉取轻量级模型

Ollama 安装好后，在终端运行：

```bash
# 拉取轻量级模型（约 2GB）
ollama pull llama3.2:3b

# 测试模型
ollama run llama3.2:3b "你好"
```

首次拉取需要下载约 2GB，请耐心等待。

---

## 验证 Ollama 服务

```bash
# 检查服务是否运行
curl http://localhost:11434

# 应该返回: Ollama is running
```

---

## 完成后告诉我

安装并拉取模型完成后，在终端运行：
```bash
ollama list
```

把输出告诉我，我会帮你启动项目！
