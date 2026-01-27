#!/bin/bash

# 启动 Cloudflare 公网隧道

echo "======================================"
echo "  启动公网访问隧道"
echo "======================================"
echo ""

# 检查应用是否运行
if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 应用未在 8080 端口运行"
    echo "请先运行: ./start.sh"
    echo ""
    exit 1
fi

echo "✅ 应用正在运行"
echo ""
echo "正在创建公网隧道..."
echo "请稍候，获取公网地址中..."
echo ""

# 启动隧道
cloudflared tunnel --url http://localhost:8080

echo ""
echo "======================================"
echo "  隧道已停止"
echo "======================================"
