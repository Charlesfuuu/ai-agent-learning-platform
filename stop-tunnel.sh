#!/bin/bash

# 停止 Cloudflare 隧道

echo "正在停止公网隧道..."

# 查找并停止 cloudflared 进程
PID=$(ps aux | grep 'cloudflared tunnel' | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "未找到运行中的隧道"
else
    echo "找到隧道进程 PID: $PID"
    kill $PID
    echo "公网隧道已停止"
fi
