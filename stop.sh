#!/bin/bash

# AI Agent 学习平台停止脚本

echo "正在停止 AI Agent 学习平台..."

# 查找并停止进程
PID=$(ps aux | grep 'ai-agent-learning-platform' | grep -v grep | grep -v stop.sh | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "未找到运行中的应用"
else
    echo "找到进程 PID: $PID"
    kill $PID
    echo "应用已停止"
fi
