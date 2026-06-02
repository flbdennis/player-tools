# AGENTS.md

## 1. 项目定位

MetisTools 是面向中/英文创作者、开发者、运营人员的视频工具网站，域名为 `https://metistools.com`。当前只开发英文页面，首期上线 `M3U8/HLS Player`、`MP4 Player`、`DASH Player`，完成后提交 Google AdSense 审核，并依靠广告流量收益。

## 2. 开发方式

* 开发环境：`VS Code + Codex`。
* 技术栈：`Astro + Tailwind CSS + JavaScript`。
* 禁止使用 `TypeScript`，不要创建 `.ts`、`.tsx`、`tsconfig`。
* 优先静态化渲染；只有播放器、表单、校验、跳转等必要交互使用 JavaScript。

## 3. UI 与样式规则

* UI 设计图放在 `UI/` 目录下，仅在确认布局、颜色、间距或结构时查看，禁止无目的反复读取。
* 禁止把 UI 设计图整图当作页面背景。
* 开发前必须根据 UI 图提取颜色、字体、间距、圆角、阴影、容器宽度和断点，并集中配置为 Tailwind/CSS 样式 token。
* 页面必须复用样式 token 和公共组件，禁止零散写死样式。
* 全站必须保持页面稳定、低 CLS、低 JS 体积；图片已压缩，只需做好尺寸、`alt`、懒加载和响应式适配。
* 必须针对移动端进行相应样式处理

## 4. 语言与注释规则

* 规则文档、开发说明、代码注释必须使用中文。
* 文件名、路径、技术名、组件名、变量名、API ID、URL、英文页面文案等保留原文。
* 页面前台只显示英文，不做多语言；UI 图中的中文内容必须翻译成自然、简洁的英文。
* 每个功能、组件、关键逻辑、重要设置都必须写中文注释。
* SEO、AdSense、播放器初始化、URL 校验、表单状态、路由跳转、配置读取必须重点注释。
* 注释要说明用途、限制和关键原因，禁止无意义注释。

## 5. 配置规则

公共文本、站点信息、SEO、导航、工具数据必须通过配置文件管理，禁止在组件中硬编码共享文本。

建议结构：

* `src/config/site.js`：域名、邮箱、统计/广告 ID、Logo 路径、全局 SEO。
* `src/config/nav.js`：Header/Footer 导航。
* `src/config/tools.js`：M3U8、MP4、DASH 工具名称、描述、路由。
* `src/config/home.js`：首页文案、区块、FAQ、CTA。

必填配置：

```js
export const site = {
  name: 'MetisTools',
  domain: 'https://metistools.com',
  email: 'flbdennis.fan@gmail.com',
  googleAnalyticsId: 'G-87VGYW1H47',
  googleAdsenseId: 'ca-pub-3912115209665374'
}
```

## 6. 素材规则

* 插图统一放在 `public/imgs/`。
* Logo 统一放在 `public/logo/`。
* 只能使用已有插图和 Logo，不得重绘、重新生成、改色、裁切或替换。

## 7. 路由规则

当前只开发以下工具页面：

* `/m3u8-player/`
* `/mp4-player/`
* `/dash-player/`

目前没有工具分类页。首页工具卡片、CTA、导航中的工具入口必须直接跳转到对应工具页。

## 8. 组件规则

* 必须高封装、高复用、高扩展，页面只负责组合组件和读取配置。
* 必须优先创建并复用：`BaseLayout`、`Header`、`Footer`、`SEO`、`Container`、`SectionHeader`、`Button`、`Icon`、`Card`、`FormField`、`TextInput`、`Select`、`Textarea`、`Checkbox`、`Radio`、`PlayerShell`。
* 所有表单元素必须封装。页面文件禁止直接写原生 `<input>`、`<button>`、`<select>`、`<textarea>`、`alert()`、`confirm()`、`prompt()`。
* 原生表单元素只能出现在基础组件内部；缺少组件时必须先创建再使用。
* 必须有语义化 HTML、可访问名称、键盘焦点样式、错误提示和校验状态。

## 9. Icon 规则

* 严格遵守 `icon解决方案.rtf`。
* 只使用 `Lucide` 图标库：`https://lucide.dev/icons/`。
* 禁止使用 emoji、截图图标、混合图标库。
* 所有 icon 必须通过本地 `Icon` 组件或 helper 统一封装，统一管理尺寸、线宽、圆角和颜色传参；颜色按 UI 图设置，禁止在页面中零散写死样式。

## 10. SEO 规则

* 每个页面必须有唯一 `title`、`description`、`canonical`、Open Graph、Twitter metadata。
* 每个页面只能有一个清晰的 `H1`。
* 重要内容必须是可爬取 HTML，不要完全依赖客户端渲染。
* 图片必须有准确 `alt`。
* 只能链接真实页面，禁止死链、假链接、假社交账号。
* 必须准备 `robots.txt`、`sitemap.xml`、favicon。
* 合适页面加入结构化数据：`WebSite`、`Organization`、`WebApplication`。

## 11. AdSense 审核规则

* 网站必须有原创、有用、可访问的内容。
* 必须有清晰导航、联系方式和政策页面。
* 必须准备：`/about/`、`/contact/`、`/privacy-policy/`、`/terms/`。
* 禁止假广告、误导按钮、弹窗诱导、强制跳转、自动下载、恶意行为。
* 广告位不要靠近播放器控制区、表单提交按钮或容易误点的位置。
* 审核前只接入官方 AdSense 脚本，禁止展示模拟广告、假广告位或占位广告内容。
* 必须提示用户只测试公开或已授权的视频链接，并遵守版权和服务条款。

## 12. 代码质量与验收

* 文件要小而清晰，保持单一职责。
* 重复 UI 和重复文案必须抽组件或配置。
* 列表、卡片、FAQ、导航必须数据驱动渲染。
* 不引入无用依赖。
* 完成前必须检查：构建通过、响应式正常、链接可用、SEO 标签存在、无 console error、无页面可见中文、关键代码有中文注释。
