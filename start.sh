#!/bin/bash

# AI Agent 学习平台启动脚本

echo "======================================"
echo "  AI Agent 学习平台"
echo "======================================"
echo ""

# 设置 Java 11 环境
export JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# 检查 Java 版本
echo "当前使用的 Java 版本:"
java -version
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查端口是否被占用
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "警告: 端口 8080 已被占用，请先停止其他服务或修改配置文件中的端口"
    echo ""
    exit 1
fi

echo "正在启动应用..."
echo "访问地址: http://localhost:8080/index.html"
echo "按 Ctrl+C 停止应用"
echo ""
echo "======================================"
echo ""

# 启动应用
mvn spring-boot:run
