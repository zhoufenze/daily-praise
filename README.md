# 夸夸

夸夸是一个轻量单页网页工具。用户每天打开页面时，会看到一句中文赞美和一首对应的轻快音乐，给当天一点积极、轻松的能量。

## Features

- 每天默认展示固定的一组内容
- 中文赞美与本地轻音乐一一绑定
- 四种赞美风格：温暖、专业、幽默、高情商
- 点击 `换一句` 后同步切换赞美和音乐
- 音乐由用户点击后播放，符合浏览器播放限制
- 响应式桌面和移动端布局
- PostHog 事件埋点，支持后续观察点击率和使用行为

## Local Preview

直接在浏览器中打开 `index.html`。

## Analytics Events

V2 当前发送：

- `page_view`
- `praise_impression`
- `praise_next_click`
- `praise_style_click`
- `music_play_click`
- `music_pause_click`
- `music_change`

详细指标设计见 `analytics-plan.md`。

## Music Assets

音乐文件位于 `music/`，版权说明见 `music-credits.md`。
