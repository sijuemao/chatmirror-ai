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

## 部署到公网

推荐使用 Vercel：

1. 注册或登录 Vercel。
2. 将 `ai-chat-prototype` 文件夹上传到 GitHub 仓库，或使用 Vercel CLI。
3. 在 Vercel 中导入该仓库，Root Directory 选择项目目录。
4. Framework Preset 选择 `Other`，Build Command 留空，Output Directory 留空。
5. 点击 Deploy，完成后会得到一个 `vercel.app` 公网地址。

如果使用命令行，可在项目目录执行：

```powershell
npm i -g vercel
vercel --prod
```

部署后，手机、平板和其他电脑都可以通过公网地址打开，不需要运行本地 Python 服务。

## 自定义 API

在“模型与 API 设置”中填写 OpenAI 兼容的聊天接口地址、模型名称和 API Key，并勾选启用。当前原型由浏览器直接请求接口，只适合本地调试；API Key 只在当前页面会话中使用，不写入本地存储。正式部署必须增加后端代理，不能把 Key 暴露给浏览器。

## 下一步

1. 增加真实后端和数据库
2. 将 API Key 改为后端加密保存
3. 增加更准确的聊天记录解析和风格档案
4. 增加语音转文字、语气分析和授权语音合成
5. 再封装成微信小程序前端

当前版本的数据仍保存在每台设备自己的浏览器中。要实现不同设备共享人物档案、聊天记录和表情包，需要下一步接入后端数据库、用户登录和文件存储。
