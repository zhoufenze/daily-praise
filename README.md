# 夸夸

夸夸是一个轻量单页网页工具。用户每天打开页面时，会看到一句中文赞美和一首对应的轻快音乐，给当天一点积极、轻松的能量。

## Features

- 每天默认展示固定的一组内容
- 中文赞美与本地轻音乐一一绑定
- 四种赞美风格：温暖、专业、幽默、高情商
- 点击 `换一句` 后同步切换赞美和音乐
- 接入 CloudBase 轻会员次数：未登录每天免费 3 次，登录后可领取额外次数
- 手机号验证码登录 / 注册入口，首次注册后赠送额外次数
- 音乐由用户点击后播放，符合浏览器播放限制
- 响应式桌面和移动端布局
- PostHog 事件埋点，支持后续观察点击率和使用行为

## Local Preview

直接在浏览器中打开 `index.html`，或用本地静态服务器预览。

本地预览时如果 CloudBase SDK 或域名授权不可用，页面会使用本地临时次数方便检查界面。正式部署到 GitHub Pages 后，会调用 CloudBase 云函数记录次数。

CloudBase SDK 会在页面内容先渲染完成后再加载，避免外部脚本变慢时影响用户先看到夸夸内容。

## Membership Backend

公开配置在 `membership-config.js`。

当前 CloudBase 环境：

- 环境 ID：`kuakua-d6gh7a5yqca535d62`
- 地域：上海 `ap-shanghai`
- 客户端 Publishable Key：生成后填写到 `membership-config.js` 的 `publishableKey`
- 云函数：`getQuotaStatus`、`consumePraiseCredit`、`grantLoginBonus`
- 数据库集合：`users_profile`、`user_balances`、`daily_usage`、`credit_transactions`、`orders`

不要把服务端 API Key、SecretId、SecretKey 放进前端文件。Publishable Key 是客户端公开 Key，可以放在前端配置中。

## Analytics Events

V2 当前发送：

- `page_view`
- `praise_impression`
- `praise_next_click`
- `praise_style_click`
- `music_play_click`
- `music_pause_click`
- `music_change`
- `quota_status_loaded`
- `free_quota_used`
- `bonus_credit_used`
- `quota_exhausted`
- `login_button_click`
- `sms_code_request`
- `phone_register_success`
- `phone_login_success`

详细指标设计见 `analytics-plan.md`。

## Music Assets

音乐文件位于 `music/`，版权说明见 `music-credits.md`。
