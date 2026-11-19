# 小象的博客

> 记录，思考，分享。

一个基于 [Hexo](https://hexo.io/) 搭建的个人博客，使用 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题，并集成 elog 实现多平台写作与同步。

- 在线站点：<https://blog.smallelephant.de5.net>
- 新站点：<https://blog.xiaoxiang.autos>
- 自建 Waline 评论系统：请参考 [waline-on-worker 分支](https://github.com/devxiaoxiang/blog/tree/waline-on-worker)

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
- **多平台写作**：通过 elog 支持从语雀（Token / 账号密码）、Notion、FlowUs 同步文章到本地，同步时自动处理 Front Matter 与图片上传。
- **多图床支持**：可配置腾讯云 COS、阿里云 OSS、七牛云、又拍云、GitHub 等作为图床。
- **自动化脚本**：内置 `hexo.sh` 交互式菜单，一键完成本地预览、构建、部署、升级与提交。
- **SEO 友好**：内置 sitemap、百度 sitemap、RSS、结构化数据等生成器。

## 技术栈

| 类别 | 依赖 |
| --- | --- |
| 静态站点框架 | Hexo 8.x |
| 主题 | hexo-theme-butterfly |
| Markdown 渲染 | hexo-renderer-markdown-it |
| 模板引擎 | hexo-renderer-pug / hexo-renderer-stylus |
| 文章同步 | @elog/cli |
| 其他 | hexo-generator-sitemap / feed / wordcount 等 |

具体版本以 [`package.json`](./package.json) 为准。

## 快速开始

### 环境要求

- Node.js 18 及以上
- npm 或 pnpm

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/devxiaoxiang/blog.git
cd blog

# 安装依赖
npm install

# 赋予脚本执行权限（可选）
chmod +x hexo.sh

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

第三方服务的 Token、ID 等同样建议放在部署平台的 Secrets 中，不要提交到仓库。

注意：Hexo 与主题配置**不会自动解析** `${{ secrets.XXX }}` 这类占位符——GitHub Actions 的 `secrets` 上下文只在 workflow 文件中生效。若希望在 `_config.butterfly.yml` 中引用密钥，需要在构建前用脚本渲染配置文件，例如：

```bash
# 在 CI 的 build 步骤之前执行
envsubst < _config.butterfly.tpl.yml > _config.butterfly.yml
npm run clean && npm run build
```

其中模板文件里写作 `${WALINE_SERVER_URL}` 等环境变量形式，对应密钥由 CI 注入环境变量。也可自行编写 Node 脚本完成同样的替换。

## 目录结构

```text
.
├── _config.yml                 # Hexo 站点配置
├── _config.butterfly.yml       # Butterfly 主题配置
├── package.json                # 依赖与 npm scripts
├── hexo.sh                     # 交互式运维脚本
├── scaffolds/                  # 文章/页面模板
├── scripts/                    # Hexo 自定义脚本（helpers、生成器等）
├── source/                     # 站点源文件
│   ├── _posts/                 # 文章（含 elog 同步内容）
│   ├── _data/                  # 主题用数据文件
│   ├── about/                  # 关于页
│   ├── categories/             # 分类页
│   ├── tags/                   # 标签页
│   ├── css/  js/  images/      # 自定义静态资源
├── elog/                       # elog 多平台同步配置
│   ├── .elog.env               # 本地环境变量（已忽略，勿提交）
│   └── ...                     # 语雀 / Notion / FlowUs 配置
├── themes/
│   └── butterfly/              # Butterfly 主题
├── .github/workflows/          # CI/CD 流水线
├── public/                     # 构建产物（生成，勿提交）
├── node_modules/               # 依赖（忽略）
├── LICENSE
└── README.md
```

> 目录可能随版本调整，以仓库实际内容为准。

## 许可证

本项目采用 [Apache License 2.0](./LICENSE) 开源，可自由使用、修改与分发，惟需遵守许可证中的条款。

Butterfly 主题按其自身许可证授权，详见 [`themes/butterfly/LICENSE`](./themes/butterfly/LICENSE)。

---

Copyright © 小象
