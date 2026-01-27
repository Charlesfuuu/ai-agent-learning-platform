#!/bin/bash

# AI Agent 学习平台编译脚本

echo "======================================"
echo "  编译 AI Agent 学习平台"
echo "======================================"
echo ""

# 设置 Java 11 环境
export JAVA_HOME=/Users/fushenlin/Library/Java/JavaVirtualMachines/corretto-11.0.28/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# 进入项目目录
cd "$(dirname "$0")"

echo "当前使用的 Java 版本:"
java -version
echo ""

echo "开始编译..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "  编译成功！"
    echo "======================================"
    echo ""
    echo "可以使用以下命令启动应用:"
    echo "  ./start.sh"
else
    echo ""
    echo "======================================"
    echo "  编译失败，请检查错误信息"
    echo "======================================"
    exit 1
fi
