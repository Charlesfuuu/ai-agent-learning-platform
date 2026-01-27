#!/bin/bash

# AI Agent 学习平台 - 快速启动脚本

cd "$(dirname "$0")"

echo "=========================================="
echo "  选择要执行的任务"
echo "=========================================="
echo ""
echo "1. 启动应用 (start-app)"
echo "2. 检查状态 (check-status)"
echo "3. 切换模型 (switch-model)"
echo "4. 测试 API (test-api)"
echo "5. 查看部署指南 (deploy)"
echo "6. 查看开发指南 (develop)"
echo "0. 退出"
echo ""
read -p "请输入选项 [0-6]: " choice

case $choice in
    1)
        echo ""
        echo "【启动应用】"
        echo ""

        # 检查 Ollama
        if curl -s http://localhost:11434/api/version >/dev/null 2>&1 ; then
            echo "✅ Ollama 正在运行"
        else
            echo "⚠️  Ollama 未运行，请先启动 Ollama"
            exit 1
        fi

        # 检查端口
        if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "❌ 端口 8080 已被占用"
            lsof -Pi :8080 -sTCP:LISTEN
            exit 1
        fi

        # 启动应用
        ./start.sh
        ;;

    2)
        echo ""
        echo "【检查状态】"
        echo ""

        # 应用状态
        echo "【1】应用状态："
        if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            PID=$(lsof -Pi :8080 -sTCP:LISTEN -t)
            echo "  ✅ 应用正在运行 (PID: $PID)"
            echo "  📍 http://localhost:8080/index.html"
        else
            echo "  ❌ 应用未运行"
        fi
        echo ""

        # Ollama 状态
        echo "【2】Ollama 服务："
        if curl -s http://localhost:11434/api/version >/dev/null 2>&1 ; then
            VERSION=$(curl -s http://localhost:11434/api/version | jq -r '.version' 2>/dev/null || echo "未知")
            echo "  ✅ Ollama 正在运行 (版本: $VERSION)"
        else
            echo "  ❌ Ollama 未运行"
        fi
        echo ""

        # 模型列表
        echo "【3】已安装的模型："
        ollama list 2>/dev/null | grep -v "^NAME" || echo "  无模型"
        echo ""

        # 当前配置
        echo "【4】当前配置的模型："
        grep "model-name:" src/main/resources/application.yml | awk '{print "  " $2}'
        echo ""
        ;;

    3)
        echo ""
        echo "【切换模型】"
        echo ""

        # 显示当前模型
        CURRENT_MODEL=$(grep "model-name:" src/main/resources/application.yml | awk '{print $2}')
        echo "当前模型: $CURRENT_MODEL"
        echo ""

        # 显示可用模型
        echo "已安装的模型:"
        ollama list
        echo ""

        echo "推荐模型:"
        echo "  - llama3.2:3b (轻量级，2GB)"
        echo "  - qwen2.5:7b (中文强，4-5GB)"
        echo "  - deepseek-r1:7b (代码强，4-5GB)"
        echo ""

        read -p "请输入要切换的模型名称 (直接回车取消): " new_model

        if [ -z "$new_model" ]; then
            echo "已取消"
            exit 0
        fi

        # 检查模型是否存在
        if ! ollama list | grep -q "^$new_model"; then
            read -p "模型未安装，是否拉取? [y/N]: " pull_confirm
            if [ "$pull_confirm" = "y" ] || [ "$pull_confirm" = "Y" ]; then
                ollama pull "$new_model"
            else
                echo "已取消"
                exit 0
            fi
        fi

        echo "修改配置文件并重启应用..."
        echo "请手动执行:"
        echo "  1. 编辑 src/main/resources/application.yml"
        echo "  2. 将 model-name 改为: $new_model"
        echo "  3. 运行 ./stop.sh && ./start.sh"
        ;;

    4)
        echo ""
        echo "【测试 API】"
        echo ""

        # 检查应用是否运行
        if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "❌ 应用未运行，请先启动应用"
            exit 1
        fi

        echo "选择测试类型:"
        echo "  1. 测试对话接口"
        echo "  2. 测试代码审查接口"
        echo "  3. 测试会话记忆"
        echo ""
        read -p "请选择 [1-3]: " test_choice

        case $test_choice in
            1)
                echo ""
                echo "【测试对话接口】"
                curl -X POST http://localhost:8080/api/chat \
                  -H "Content-Type: application/json" \
                  -d '{"sessionId": "test", "message": "你好，请简单介绍一下自己"}'
                echo ""
                ;;
            2)
                echo ""
                echo "【测试代码审查接口】"
                curl -X POST http://localhost:8080/api/code/review \
                  -H "Content-Type: application/json" \
                  -d '{"code": "public class Test { public static void main(String[] args) { System.out.println(\"Hello\"); } }", "language": "java"}'
                echo ""
                ;;
            3)
                echo ""
                echo "【测试会话记忆】"
                echo "第一轮对话:"
                curl -X POST http://localhost:8080/api/chat \
                  -H "Content-Type: application/json" \
                  -d '{"sessionId": "memory-test", "message": "我的名字叫张三"}'
                echo ""
                echo ""
                echo "第二轮对话:"
                curl -X POST http://localhost:8080/api/chat \
                  -H "Content-Type: application/json" \
                  -d '{"sessionId": "memory-test", "message": "你还记得我的名字吗？"}'
                echo ""
                ;;
        esac
        ;;

    5)
        echo ""
        echo "【部署指南】"
        cat .claude/skills/deploy.md
        ;;

    6)
        echo ""
        echo "【开发指南】"
        cat .claude/skills/develop.md
        ;;

    0)
        echo "退出"
        exit 0
        ;;

    *)
        echo "无效选项"
        exit 1
        ;;
esac
