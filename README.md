# taosheng.app

涛声官网。Astro 静态站 + Cloudflare Pages Functions，中文在 `/`，英文在 `/en/`。

## 开发

```bash
npm ci
npm run dev        # 本地预览
npm run build      # 构建到 dist/
```

## 结构

- `src/components/Home.astro`：首页（“一天”滚动叙事，滚到夜里整页变暗）
- `src/components/phone/`：高仿真 App 界面（HTML 复刻，360×800 逻辑像素，示例数据均为虚构）
- `src/data/`：全部文案（`home.ts`、`guide.ts` 新手指南、`legal.ts` 隐私与条款）和版本信息
- `functions/api/download-apk.js`：下载按钮，302 到魔搭最新正式版安装包
- `functions/api/release.js`：最新版本、大小、SHA-256（读魔搭 `update.json`），页面打开时刷新按钮上的版本
- `public/_redirects`：旧地址 `/contact`、`/pricing` 的跳转

## 导出界面图

```bash
npm run build && npx astro preview --port 4329   # 另开一个终端
npm run shots   # 导出 design/screens/*.png（1080×2400）和 public/og-cover.jpg，需要本机 Chrome
```

## 部署

推送到 `main` 后，GitHub Actions 构建并发布到 Cloudflare Pages 项目 `taosheng-official-site`；每天也会自动重新构建一次，让页面里的版本号跟上 App 发版。需要仓库密钥 `CLOUDFLARE_API_TOKEN`（仅 Pages 编辑权限）和 `CLOUDFLARE_ACCOUNT_ID`。

手动发布：`npm run deploy`（正式）或 `npm run deploy:preview`（预览地址）。
