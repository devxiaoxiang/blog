# Waline on Worker · 单文件版

> 一个文件跑起来的 Waline 评论服务端 —— 部署在 Cloudflare Workers，数据存于 D1。

这是 [Waline on Worker](https://github.com/wuyilingwei/Waline_On_Worker) 的**单文件打包版**：整个后端（路由、评论、浏览量、用户、管理面板、D1 建表）全部浓缩在一个 `worker.js` 里，复制粘贴即可部署，无需 `npm install`、无需构建。

项目架构与配套文件组织参考自我的 [小象部署 host](https://github.com/devxiaoxiang/host) 项目。

## 功能特性

- **单文件**：一个 `worker.js` 包含全部逻辑，开箱即用
- **免运维**：运行在 Cloudflare 边缘网络，免费额度足够个人博客使用
- **自动建表**：首次请求自动初始化 D1 数据表，无需手动执行 SQL
- **完整兼容**：兼容 `@waline/client` 前端与 `@waline/admin` 管理面板
- **功能齐全**：评论增删改查、楼中楼、点赞置顶、浏览量/表情反应、Markdown + XSS 防护、Gravatar 头像、UA 解析、RSS、注册登录、JWT 鉴权、数据导入导出、反垃圾（Akismet / LLM）等
- **管理后台**：内置 `/ui` 管理面板与 `/ui/worker-setting` 设置页

## 部署步骤

### 1. 创建 D1 数据库

在 Cloudflare 控制台进入 **Workers & Pages → D1**，创建一个数据库（例如 `waline-db`），记下它的 **Database ID**。

```bash
wrangler d1 create waline-db
```

### 2. 创建 Worker 并绑定 D1

在 Cloudflare 控制台创建一个新的 Worker，进入 **Settings → Variables and Bindings → D1 Database Bindings**：

- 变量名（Binding）填写 `DB`（**必须与代码一致**）
- 选择上一步创建的 D1 数据库

### 3. 设置密钥

在 Worker 的 **Settings → Variables and Secrets** 添加环境变量：

| 变量 | 是否必填 | 说明 |
| --- | --- | --- |
| `JWT_SECRET` | **必填** | 登录鉴权密钥，建议 32 位以上随机字符串 |
| `SITE_URL` | 选填 | 你的博客地址，用于反垃圾与头像代理 |
| `SECURE_DOMAINS` | 选填 | 允许的跨域来源，多个用英文逗号分隔 |
| `AKISMET_KEY` | 选填 | Akismet 反垃圾密钥 |
| `AUDIT` | 选填 | 设为 `true` 则匿名评论需审核 |

命令行方式：

```bash
wrangler secret put JWT_SECRET
```

### 4. 粘贴代码并部署

进入 Worker 的 **Edit Code** 页面，将本仓库 [`worker.js`](./worker.js) 的完整内容粘贴进去，点击 **Save and Deploy**。

> 也可以 clone 本仓库后，用 `wrangler deploy` 部署（配置见 [`wrangler.toml`](./wrangler.toml)，记得替换其中的 `database_id`）。

### 5. 初始化管理员

访问 `https://你的-worker域名/ui`，**第一个注册的账号会自动成为超级管理员**。注册后建议立即关闭公开注册。

## 前端接入

在你的博客页面引入 `@waline/client`，`serverURL` 填你的 Worker 地址：

```html
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<div id="waline"></div>
<script type="module">
  import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
  init({
    el: '#waline',
    serverURL: 'https://你的-worker域名',
  });
</script>
```

## 自托管前端版本

管理后台可在 `/ui/worker-setting` 里在线切换 `@waline/client` 与 `@waline/admin` 的 CDN 版本、评论默认状态、反垃圾策略等，设置保存在 D1 的 `wl_Settings` 表中。环境变量优先级高于面板设置。

## 目录结构

```text
.
├── worker.js       # 单文件服务端（全部逻辑 + 自动建表）
├── wrangler.toml   # Wrangler 部署配置（D1 绑定示例）
└── README.md       # 本说明
```

## 特别致谢

本项目使用的单文件服务端程序源自开源项目 **[Waline on Worker](https://github.com/wuyilingwei/Waline_On_Worker)**，在此向开发者团队致以诚挚感谢：

- **wuyilingwei（Siyu Lei）** —— Waline on Worker 作者，[作者博客](https://blog.wuyilingwei.com)
- **[Waline](https://waline.js.org)** 官方及其所有贡献者 —— 提供了优秀的评论系统

正是他们的开源贡献，让 Waline 得以完整运行在 Cloudflare Workers 之上。本项目仅做单文件整理与配套文档，核心代码的著作权归原作者所有。

## 许可证

本项目文档与配置采用 [Apache License 2.0](./LICENSE)。`worker.js` 的知识产权归 Waline on Worker 原作者所有，请遵守其上游项目的许可证。
