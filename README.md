# 小象的博客

> 记录，思考，分享。

一个基于 [Hexo](https://hexo.io/) 搭建的个人博客，使用 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题，并集成elog实现多平台写作与同步。

在线站点：<https://blog.smallelephant.de5.net>

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [配置说明](#配置说明)
- [目录结构](#目录结构)
- [许可证](#许可证)

## 特性

- **Hexo 8 + Butterfly 主题**：功能丰富、高度可定制，支持深色模式、PWA、文章搜索、评论系统、字数统计等。
- **多平台写作**：通过 elog 支持从语雀（Token / 账号密码）、Notion、FlowUs 同步文章到本地。
- **多图床支持**：可配置腾讯云 COS、阿里云 OSS、七牛云、又拍云、GitHub 等作为图床。
- **自动化脚本**：内置 `hexo.sh` 交互式菜单，一键完成本地预览、构建、部署、升级与提交。
- **SEO 友好**：内置 sitemap、百度 sitemap、RSS、结构化数据等生成器。

## 技术栈

| 类别 | 依赖 |
| --- | --- |
| 静态站点框架 | Hexo 8.1.2 |
| 主题 | hexo-theme-butterfly |
| Markdown 渲染 | hexo-renderer-markdown-it |
| 模板引擎 | hexo-renderer-pug / hexo-renderer-stylus |
| 文章同步 | @elog/cli 0.14.7 |
| 其他 | hexo-generator-sitemap / feed / wordcount 等 |

完整依赖见 [`package.json`](./package.json)。

## 快速开始

### 环境要求

- Node.js 18 及以上
- npm 或 pnpm

### 本地运行

```bash
# 安装依赖
npm install

# 启动本地预览，默认 http://localhost:4000
npm run server

# 清理缓存并生成静态文件到 public/
npm run clean && npm run build
```

生成静态文件后，可将 `public/` 目录部署到 GitHub Pages、Vercel、Netlify、腾讯云 COS 等任意静态托管服务。

## 常用命令

> 也可直接运行交互式脚本 `./hexo.sh`，通过菜单完成下列操作。

| 命令 | 说明 |
| --- | --- |
| `npm run server` | 启动本地预览服务 |
| `npm run build` | 生成静态站点文件 |
| `npm run clean` | 清理缓存 |
| `npm run deploy` | 部署（需在 `_config.yml` 中配置 `deploy`） |
| `npm run sync:yuque-token` | 使用 Token 从语雀同步文章 |
| `npm run sync:yuque-pwd` | 使用账号密码从语雀同步文章 |
| `npm run sync:notion` | 从 Notion 同步文章 |
| `npm run sync:flowus` | 从 FlowUs 同步文章 |

## 配置说明

### 站点配置

- `_config.yml`：Hexo 站点全局配置（标题、副标题、URL、分页、Markdown 渲染等）。
- `_config.butterfly.yml`：Butterfly 主题配置（导航、头像、评论、统计、搜索、PWA 等）。

### 文章同步（elog）

`elog/` 目录包含语雀、Notion、FlowUs 等平台的同步配置。所有密钥均通过**环境变量**读取，例如：

```bash
# 语雀（Token 方式）
YUQUE_TOKEN=xxx
YUQUE_LOGIN=xxx
YUQUE_REPO=xxx

# 图床密钥（以腾讯云 COS 为例）
COS_SECRET_ID=xxx
COS_SECRET_KEY=xxx
COS_IMAGE_BUCKET=xxx
COS_IMAGE_REGION=xxx
COS_HOST=xxx
```

> **安全提示**：请勿将任何密钥、Token 直接写入仓库文件。本地调试可将环境变量写入 `elog/.elog.env`（该文件已被忽略），生产环境请使用 CI/CD Secrets 注入。

### 评论、统计等服务

第三方服务的 Token、ID 等同样建议在部署平台的 Secret 中配置，并在 `_config.butterfly.yml` 中以 `${{ secrets.XXX }}` 形式引用。

## 目录结构

```text
.
├── _config.yml             # Hexo 站点配置
├── _config.butterfly.yml   # Butterfly 主题配置
├── elog/                   # elog 多平台同步配置
├── scaffolds/              # 文章模板
├── scripts/                # Hexo 扩展脚本
├── source/                 # 站点源码
│   ├── _posts/             # 文章 Markdown
│   ├── about/              # 关于页面
│   ├── categories/         # 分类页
│   ├── tags/               # 标签页
│   └── images/             # 图片资源
├── themes/butterfly/       # Butterfly 主题
├── hexo.sh                 # 交互式管理脚本
└── package.json            # 依赖与脚本
```

## 许可证

本项目采用 [Apache License 2.0](./LICENSE) 开源，可自由使用、修改与分发，惟需遵守许可证中的条款。

Butterfly 主题按其自身许可证授权，详见 [`themes/butterfly/LICENSE`](./themes/butterfly/LICENSE)。

---

Copyright © 小象
