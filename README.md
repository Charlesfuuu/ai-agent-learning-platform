# AI Agent 学习平台 (轻量级版本)

基于 Spring Boot + LangChain4j + Ollama 的本地 AI 编程学习助手（完全免费）。

## 功能特性

- **AI 对话** - 与本地 AI 模型进行编程学习对话，获得专业的 AI Agent 开发指导
- **代码审查** - 提交 Java 代码获得详细的反馈和改进建议
- **会话记忆** - 支持多轮对话，保持上下文连贯性
- **完全免费** - 使用 Ollama 本地运行，无需 API Key，无使用限制

## 技术栈

- Java 11 (Corretto 11.0.28)
- Spring Boot 2.7.18
- LangChain4j 0.29.1
- Ollama (本地 AI 运行时)
- 推荐模型: Qwen2.5 7B / Llama 3.2 / DeepSeek-R1
- Maven 3.6+

## 前置要求

1. JDK 11 或更高版本
2. Maven 3.6 或更高版本
3. **Ollama** - 本地 AI 运行环境（[安装指南](OLLAMA_INSTALL.md)）

## 快速开始

### 0. 环境配置

**首次使用需要配置环境变量：**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入实际配置
# 主要需要配置数据库密码
```

`.env` 文件示例：
```bash
DB_PASSWORD=your_database_password
DB_USERNAME=root
DB_URL=jdbc:mysql://localhost:3306/ai_learning?useSSL=false&serverTimezone=Asia/Shanghai
```

> **重要**: `.env` 文件包含敏感信息，已被 git 忽略，不会提交到仓库

### 1. 安装 Ollama（首次使用）

详细安装步骤请查看 [OLLAMA_INSTALL.md](OLLAMA_INSTALL.md)

**快速步骤：**
1. 访问 https://ollama.com/download 下载 macOS 版本
2. 安装并启动 Ollama
3. 拉取推荐模型：
```bash
ollama pull qwen2.5:7b
```

### 2. 使用脚本启动（推荐）

```bash
cd /Users/fushenlin/chelaile/ai-agent-learning-platform

# 编译项目
./build.sh

# 启动应用
./start.sh

# 停止应用（另一个终端）
./stop.sh
```

### 3. 使用 Maven 命令

**编译项目**

```bash
cd /Users/fushenlin/chelaile/ai-agent-learning-platform
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home mvn clean package -DskipTests
```

**运行应用**

```bash
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home mvn spring-boot:run
```

或者直接运行 JAR 包：

```bash
JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home java -jar target/ai-agent-learning-platform-1.0.0-SNAPSHOT.jar
```

**访问应用**

打开浏览器访问: http://localhost:8080/index.html

## 可用脚本

项目提供了三个便捷脚本：

### build.sh - 编译脚本
```bash
./build.sh
```
自动使用 Java 11 编译项目，跳过测试。

### start.sh - 启动脚本
```bash
./start.sh
```
自动设置 Java 11 环境并启动应用，包含端口检测。

### stop.sh - 停止脚本
```bash
./stop.sh
```
停止正在运行的应用。

## API 接口

### 对话接口

**端点**: `POST /api/chat`

**请求示例**:
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "message": "什么是LangChain4j？"
  }'
```

**响应示例**:
```json
{
  "response": "LangChain4j 是一个 Java 版本的 LangChain 框架..."
}
```

### 代码审查接口

**端点**: `POST /api/code/review`

**请求示例**:
```bash
curl -X POST http://localhost:8080/api/code/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "public class Test { public static void main(String[] args) { System.out.println(\"Hello\"); } }",
    "language": "java"
  }'
```

**响应示例**:
```json
{
  "feedback": "代码分析如下：\n1. 代码结构..."
}
```

## 项目结构

```
ai-agent-learning-platform/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/ailearn/
│   │   │   ├── AiLearningApplication.java      # 启动类
│   │   │   ├── config/
│   │   │   │   └── LangChainConfig.java        # LangChain4j 配置
│   │   │   ├── controller/
│   │   │   │   └── AiController.java           # REST 接口
│   │   │   ├── service/
│   │   │   │   ├── ChatService.java            # 对话服务
│   │   │   │   └── CodeReviewService.java      # 代码审查服务
│   │   │   └── dto/
│   │   │       ├── ChatRequest.java
│   │   │       ├── ChatResponse.java
│   │   │       ├── CodeReviewRequest.java
│   │   │       └── CodeReviewResponse.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── static/index.html               # Web 界面
│   └── test/
└── README.md
```

## 配置说明

### 环境变量配置（推荐）

所有敏感配置通过 `.env` 文件管理：

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `DB_URL` | 数据库连接地址 | jdbc:mysql://localhost:3306/ai_learning |
| `DB_USERNAME` | 数据库用户名 | root |
| `DB_PASSWORD` | 数据库密码 | **必填** |
| `OLLAMA_BASE_URL` | Ollama 服务地址 | http://localhost:11434 |
| `OLLAMA_MODEL_NAME` | 模型名称 | llama3.2:3b |
| `OLLAMA_TEMPERATURE` | 温度参数 (0-1) | 0.7 |
| `OLLAMA_TIMEOUT` | 超时时间（秒） | 60 |
| `SERVER_PORT` | 服务端口 | 8080 |

### application.yml 配置

配置文件在 `src/main/resources/application.yml`，支持通过环境变量覆盖：

```yaml
ollama:
  base-url: ${OLLAMA_BASE_URL:http://localhost:11434}
  model-name: ${OLLAMA_MODEL_NAME:llama3.2:3b}
  temperature: ${OLLAMA_TEMPERATURE:0.7}
  timeout: ${OLLAMA_TIMEOUT:60}
```

### 切换模型

修改 `model-name` 即可切换模型：
- `qwen2.5:7b` - 阿里通义千问（中文强）
- `llama3.2:3b` - Meta Llama（轻量）
- `deepseek-r1:7b` - DeepSeek 推理模型（代码强）

确保已用 `ollama pull <模型名>` 拉取对应模型。

## 使用示例

### Web 界面使用

1. 访问 http://localhost:8080/index.html
2. 在"对话学习"区域输入问题，例如："什么是 AI Agent？"
3. 在"代码审查"区域粘贴 Java 代码，点击"审查代码"

### API 使用

使用任何 HTTP 客户端（如 Postman、curl）调用上述 API 接口。

## 注意事项

1. **Ollama 服务** - 确保 Ollama 已启动并在 `http://localhost:11434` 运行
2. **模型下载** - 首次使用需要下载模型，7B 模型约 4-5GB
3. **内存要求** - 7B 模型建议至少 8GB 内存，3B 模型约 4GB
4. **完全免费** - 无 API 费用，无使用限制，数据完全本地
5. **会话历史** - 当前版本使用内存存储，应用重启后会丢失

## 后续扩展方向

- [ ] 集成数据库（MySQL/H2）持久化对话历史
- [ ] 添加向量数据库支持 RAG 知识库
- [ ] 实现用户认证和权限管理
- [ ] 添加学习路径规划功能
- [ ] 优化前端界面（React/Vue）
- [ ] Docker 容器化部署
- [ ] 添加更多编程语言支持

## 常见问题

### 1. Ollama 连接失败

确保 Ollama 服务已启动：
```bash
# 检查 Ollama 是否运行
curl http://localhost:11434

# 如果未运行，启动 Ollama（macOS）
open -a Ollama
```

### 2. 模型未找到

拉取所需模型：
```bash
# 查看已安装的模型
ollama list

# 拉取推荐模型
ollama pull qwen2.5:7b
```

### 3. Maven 依赖下载慢

配置国内镜像源，编辑 `~/.m2/settings.xml` 添加阿里云镜像。

### 4. 端口 8080 已被占用

修改 `application.yml` 中的端口配置:
```yaml
server:
  port: 8081
```

### 5. 响应速度慢

- 首次调用会加载模型到内存，需要等待
- 使用更小的模型（如 llama3.2:3b）可以加快速度
- 确保有足够的内存

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
