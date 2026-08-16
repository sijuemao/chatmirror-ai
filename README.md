# ChatMirror AI 聊天风格模拟器（网页原型）

这是第一版本地调试原型，当前包含：

- 聊天界面和本地模拟回复
- 性格、态度、回复长度设置
- TXT/CSV/JSON 聊天记录导入与基础风格分析
- 真实表情包上传与本地保存
- 浏览器语音输入（浏览器支持时）
- 自定义 OpenAI 兼容 API 配置
- 隐私提示和本地数据清除

## 运行

最简单的方式是直接打开 `index.html`。如果浏览器限制本地文件能力，可以在此目录运行：

```powershell
python -m http.server 8080
```

然后访问 http://localhost:8080 。

## 部署到 GitHub Pages

项目已经包含 GitHub Actions 配置文件 `.github/workflows/deploy-pages.yml`。推送到 `agent/chatmirror-web-prototype` 分支后，GitHub 会自动发布静态文件。

首次使用需要在 GitHub 仓库中打开：`Settings` → `Pages` → `Build and deployment` → `Source` 选择 `GitHub Actions`。

部署完成后，网站地址为：

```text
https://sijuemao.github.io/chatmirror-ai/
```

以后每次推送到该分支，GitHub Actions 都会自动更新网站，不需要运行本地 Python 服务。

## 自定义 API

在“模型与 API 设置”中填写 OpenAI 兼容的聊天接口地址、模型名称和 API Key，并勾选启用。当前原型由浏览器直接请求接口，只适合本地调试；API Key 只在当前页面会话中使用，不写入本地存储。正式部署必须增加后端代理，不能把 Key 暴露给浏览器。

## 下一步

1. 增加真实后端和数据库
2. 将 API Key 改为后端加密保存
3. 增加更准确的聊天记录解析和风格档案
4. 增加语音转文字、语气分析和授权语音合成
5. 再封装成微信小程序前端

当前版本的数据仍保存在每台设备自己的浏览器中。要实现不同设备共享人物档案、聊天记录和表情包，需要下一步接入后端数据库、用户登录和文件存储。
