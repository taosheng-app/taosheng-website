# 涛声官网 TaoSheng Website

涛声（TaoSheng）的宣传站，中英双语。涛声是一款安卓端的开源个人记忆工具：全天收音、本地转写、声纹认人，AI 把说过的话整理成待办、约定和记忆。

站点基于 [Astro](https://astro.build) 构建，纯静态输出，无后端、无数据库、无账号体系。

- 仓库：<https://github.com/taosheng-app/taosheng-website>（私有）
- App 仓库：<https://github.com/0xCoach/TaoSheng>

> English version: [README_EN.md](./README_EN.md)

## 技术栈

| 项目 | 版本 | 用途 |
|---|---|---|
| Astro | 6.3.7（锁定） | 静态站点生成，零 JS 优先 |
| Tailwind CSS | 4.3.5 | 样式，通过 `@tailwindcss/vite` 接入 |
| Alpine.js | 3.17.5 | 语言切换、移动端菜单、更新弹窗 |
| sharp | 0.34.5 | 由 `logo.svg` 生成各尺寸图标（仅开发时使用） |

包管理统一用 **npm**，锁文件是 `package-lock.json`，克隆后执行 `npm ci` 即可复现相同依赖。

运行环境要求 **Node.js >= 22.12.0**（见 `package.json` 的 `engines` 字段）。

### 为什么锁死两个版本

`package.json` 里 `astro` 写的是精确版本 `6.3.7`，并用 `overrides` 把 `vite` 固定到 `7.3.3`。原因是当前 Astro 6.4 会引入 Vite 8（rolldown 内核），而 Tailwind 4.3 的 Vite 插件在 Vite 8 下构建会直接失败：

```
[@tailwindcss/vite:generate:build] Missing field `tsconfigPaths` on BindingViteResolvePluginConfig.resolveOptions
```

这是上游兼容性问题，不是本项目配置错误。等 Tailwind 支持 Vite 8 后，去掉 `overrides` 并放开 `astro` 版本即可；升级时务必跑一次 `npm run build` 验证。

## 快速开始

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器，支持热更新 |
| `npm run build` | 生成静态站点到 `dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run deploy` | 用 Wrangler 发布到 Cloudflare Pages |
| `npm run preview:prod` | 发布并指定项目名 `taosheng-website` |
| `npm run astro` | 直接调用 Astro CLI |

> `deploy` 系列脚本依赖 `wrangler`，它没有写进 `devDependencies`。首次使用先执行 `npm i -D wrangler` 或 `npx wrangler login` 完成授权。

## 页面结构

| 路径 | 文件 | 内容 |
|---|---|---|
| `/` | `src/pages/index.astro` | 首屏、四个核心能力、工作流演示、隐私说明、行动入口 |
| `/about` | `src/pages/about.astro` | 产品定位、四条设计原则、技术栈 |
| `/download` | `src/pages/download.astro` | 两种获取方式（安装包 / 源码自建）、能力对比表、FAQ |
| `/contact` | `src/pages/contact.astro` | 问题反馈、提问与交流、邮件联系 |
| `/privacy` | `src/pages/privacy.astro` | 隐私政策：无账号、无服务器、数据只在手机 |
| `/terms` | `src/pages/terms.astro` | 使用条款、录音合规告知、MIT 许可说明 |
| `/pricing` | `src/pages/pricing.astro` | 旧路径兼容页，`meta refresh` 跳转到 `/download` |
| 404 | `src/pages/404.astro` | 未找到页面 |

涛声免费开源，没有付费方案，因此参考站的「定价」页改成了「下载」页；旧路径仍然保留跳转，避免外链失效。

## 目录结构

```
.
├── public/                  # 静态资源，原样拷贝到 dist/
│   ├── logo.svg             # 品牌主图形（橙色声波 + 回声圆）
│   ├── logo.png             # 512×512
│   ├── favicon-256.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og-cover.jpg         # 社交分享封面
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── Check.astro      # 列表勾选图标
│   │   └── NotFound.astro   # 404 内页内容
│   ├── i18n/
│   │   └── translations.ts  # 全站中英文案，唯一来源
│   ├── layouts/
│   │   └── Layout.astro     # 页头、页脚、移动菜单、更新弹窗、i18n 状态
│   ├── pages/               # 路由，一个文件一个页面
│   └── styles/
│       └── global.css       # 主题色板、字体、动画
├── astro.config.mjs
├── wrangler.toml            # Cloudflare Pages 配置
└── package.json
```

## 双语实现

站点**不是**两套页面，而是一套 DOM 加运行时替换文案，避免重复维护。

- 所有文案集中在 `src/i18n/translations.ts`，`en` 与 `zh` 两组键一一对应，各 196 条，按 `meta / header / nav / mobileMenu / footer / notFound / index / download / about / contact / privacy / terms` 分组。
- 首次访问读取 `localStorage` 的 `lang`；没有记录时按 `navigator.language` 判断，中文环境用 `zh`，其余用 `en`。
- 页头右上角「中 / EN」切换后立即替换全部文案，同时更新 `<html lang>`、`<title>`、`description`、`keywords` 以及 og 标签，并写回 `localStorage`。
- 页面 HTML 里写了中文静态文案作为兜底，JS 未执行时页面依然可读（对 SEO 和首屏友好）。
- 语言选择只影响文案，**不改变 URL**，所以搜索引擎只索引一份页面，没有 `hreflang` 之类的重复内容问题。

新增一条文案的标准做法：

```ts
// src/i18n/translations.ts
en: { download: { faq6Q: 'Does it drain battery?', faq6A: '...' } },
zh: { download: { faq6Q: '会很耗电吗？', faq6A: '……'     } },
```

```astro
<h3 x-text="$store.i18n.t('download.faq6Q')">会很耗电吗？</h3>
```

两边键名必须完全一致。缺键时 `t()` 会原样返回键名（界面上直接露出 `download.faq6Q` 这种字符串），这是唯一的自查信号。

## 内容维护

改内容前先看这几处，基本覆盖了日常更新：

- **版本号**：`v0.2.20` 硬编码在 `src/i18n/translations.ts` 的 `footer.version` 与 `download.apkBtn`（中英共 4 处），发版时一起改。
- **仓库链接**：`src/layouts/Layout.astro` 顶部集中定义了 `REPO`、`RELEASES`、`README`、`CHANGELOG`、`CARDS`、`LICENSE` 六个常量，其余页面引用它们。App 仓库若迁到组织下，只改这里即可。
- **页面元信息**：`Layout.astro` 的 `Props` 支持 `title / description / keywords` 及对应的 `titleEn / descEn / keywordsEn`，各页面在 frontmatter 里传入。
- **canonical**：默认值是 `'/'`，属于占位。**部署前**必须换成实际域名的绝对地址，否则 canonical 与 `og:url` 都会指向相对路径。
- **不要引入 `@alpinejs/collapse`**：移动端菜单用的是 Alpine 核心的 `x-transition`。该插件在 Alpine 3.17 下会让菜单展开高度停在 `0px`（按钮 `aria-expanded` 变成 true，但菜单不可见），已从依赖中移除，别再加回来。
- **图标**：修改 `public/logo.svg` 后重新生成 PNG：

```bash
node -e "const sharp=require('sharp'),fs=require('fs');const svg=fs.readFileSync('public/logo.svg');(async()=>{for(const [n,s] of [['logo.png',512],['favicon-256.png',256],['favicon-32.png',32],['apple-touch-icon.png',180]]){await sharp(svg).resize(s,s).png().toFile('public/'+n)}console.log('icons generated')})()"
```

## 部署

构建产物是纯静态文件，可部署到任意静态托管。

Cloudflare Pages：

```bash
npm run build
npx wrangler pages deploy dist
```

`wrangler.toml` 已声明 `name = "taosheng-website"`、`pages_build_output_dir = "dist"`，构建命令填 `npm run build`、输出目录填 `dist` 即可。

## 相关项目

- 涛声 App 及完整文档：<https://github.com/0xCoach/TaoSheng>
- 最新版本下载：<https://github.com/0xCoach/TaoSheng/releases/latest>

## 许可

站点内容与涛声 App 保持一致，遵循 MIT 许可。品牌名、Logo 与封面图属于涛声项目，转载或二次使用请注明来源。
