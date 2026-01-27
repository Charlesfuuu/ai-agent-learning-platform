# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 项目概述

AI Agent 学习平台 - 基于 Spring Boot + LangChain4j + Ollama 构建的本地免费 AI 编程学习助手。提供基于对话的学习功能和 Java 代码审查功能。

## 构建与运行命令

**关键提示：本项目需要 Java 11，但系统默认是 Java 8。**

所有 Maven 命令必须添加前缀：
```bash
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home
```

### 使用辅助脚本（推荐）
```bash
# 构建项目
./build.sh

# 启动应用
./start.sh

# 停止应用
./stop.sh

# 启动公网隧道（需要 cloudflared）
./start-tunnel.sh

# 停止公网隧道
./stop-tunnel.sh
```

### 手动 Maven 命令
```bash
# 清理构建（跳过测试）
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home mvn clean package -DskipTests

# 运行应用
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home mvn spring-boot:run

# 直接运行 JAR 包
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home java -jar target/ai-agent-learning-platform-1.0.0-SNAPSHOT.jar
```

### 前置条件
- Ollama 必须运行在 http://localhost:11434
- 模型必须已拉取：`ollama pull llama3.2:3b`（或配置的模型）
- 检查 Ollama 状态：`curl http://localhost:11434`
- 列出模型：`ollama list`

## 架构与关键模式

### LangChain4j 集成架构

本项目使用**无状态 AI 服务层**和**手动提示词构建**模式：

1. **配置层** (`LangChainConfig.java`)：
   - 使用 `OllamaChatModel.builder()` 创建单个 `ChatLanguageModel` Bean
   - 从 `application.yml` 读取配置：base-url、model-name、temperature、timeout
   - 通过 Spring DI 注入到服务类中

2. **服务层模式**：
   - 服务类通过构造函数注入接收 `ChatLanguageModel`
   - **手动构建提示词**：服务类将完整提示词构建为字符串
   - 每次请求调用 `chatModel.generate(String prompt)`
   - 不使用 LangChain4j 的对话记忆/链式调用 - 采用自定义实现

3. **聊天历史管理** (`ChatService.java`)：
   - 内存 HashMap：`Map<String, List<String>> chatHistory`
   - **非持久化** - 应用重启后丢失
   - 手动构建提示词：SYSTEM_PROMPT + 最近 5 轮对话 + 当前消息
   - 格式："User: {message}\nAssistant: {response}\n..."

4. **代码审查模式** (`CodeReviewService.java`)：
   - 无状态 - 无历史记录
   - 使用格式化的提示词模板注入代码
   - 直接调用 `chatModel.generate()`

### 关键版本依赖

**LangChain4j 0.29.1** - 不要升级到 0.29.x 以上：
- 0.30+ 版本需要 Java 17（字节码版本 61.0）
- Java 11 仅支持字节码版本 55.0
- 破坏性变更：更新版本会导致编译错误

**Spring Boot 2.7.18** 配合 Java 11：
- 稳定组合
- 使用 Tomcat 9.0.83

### Controller → Service → Model 流程

```
HTTP 请求 → AiController (@RestController)
    ↓
ChatService / CodeReviewService (@Service)
    ↓
ChatLanguageModel (LangChain4j Bean)
    ↓
OllamaChatModel (HTTP 客户端访问 localhost:11434)
    ↓
Ollama 运行时 → 本地 LLM
```

**重要**：服务层不使用 LangChain4j 的记忆/链式抽象，而是手动构建提示词并管理状态。

### 会话管理

- `ChatRequest` 中的 `sessionId` 字段支持多用户对话
- 每个 sessionId 有独立的对话历史
- Web 界面使用硬编码的 sessionId：`"web-session"`
- 历史记录保存在内存中（非持久化）

## 配置说明

### 切换 AI 模型

编辑 `src/main/resources/application.yml`：
```yaml
ollama:
  model-name: llama3.2:3b  # 修改这里
```

支持的模型（需先拉取）：
- `llama3.2:3b` - 轻量级（2GB）
- `qwen2.5:7b` - 中文支持更好（4-5GB）
- `deepseek-r1:7b` - 代码分析更强（4-5GB）

### 修改服务端口

编辑 `application.yml`：
```yaml
server:
  port: 8080  # 端口冲突时修改这里
```

## API 接口

**对话接口**：`POST /api/chat`
```json
{
  "sessionId": "session-123",
  "message": "什么是 LangChain4j？"
}
```

**代码审查接口**：`POST /api/code/review`
```json
{
  "code": "public class Test { ... }",
  "language": "java"
}
```

## 重要约束

1. **Java 版本**：始终通过 JAVA_HOME 前缀使用 Java 11（系统默认是 Java 8）
2. **LangChain4j 版本**：不能升级到 0.29.x 以上，除非升级到 Java 17
3. **Ollama 依赖**：Ollama 未运行时应用会失败
4. **聊天历史**：仅内存存储 - 重启后丢失
5. **无认证**：无用户系统 - 所有请求匿名
6. **CORS**：允许所有来源（`@CrossOrigin(origins = "*")`）

## 常见问题

- **"Invalid target release: 11"**：忘记设置 JAVA_HOME 前缀
- **"Class file has wrong version 61.0"**：LangChain4j 版本对 Java 11 太高
- **Connection refused to localhost:11434**：Ollama 未运行
- **Model not found**：需要运行 `ollama pull <模型名>`
- **Port 8080 in use**：在 application.yml 中修改端口或停止其他服务
