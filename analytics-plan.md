# 夸夸 Analytics Plan

## Goal

上线后需要知道用户是否打开页面、是否继续换一句、偏好哪种风格、是否愿意播放音乐。

## Core Metrics

### Page Views

Event: `page_view`

Purpose:

- 统计页面打开次数。
- 估算基础流量。

Payload:

- `dateKey`

### Praise Impressions

Event: `praise_impression`

Purpose:

- 统计赞美内容曝光次数。
- 观察不同风格和不同内容的展示情况。
- 与 `praise_next_click` 配合计算平均浏览条数。

Payload:

- `style`
- `praiseId`
- `praiseText`
- `praiseIndex`
- `musicTitle`
- `musicFile`
- `reason`

### Next Button Clicks

Event: `praise_next_click`

Purpose:

- 衡量用户是否愿意继续获得新的赞美。
- 这是未来付费次数逻辑最重要的前置指标。

Payload:

- `style`
- `previousPraiseId`
- `previousPraiseText`
- `previousMusicTitle`
- `nextStyleIndex`

### Style Switch Clicks

Event: `praise_style_click`

Purpose:

- 衡量用户是否探索不同赞美风格。
- 对比四种风格偏好。

Payload:

- `fromStyle`
- `toStyle`
- `previousPraiseId`

### Music Play Clicks

Event: `music_play_click`

Purpose:

- 衡量音乐功能是否被用户使用。
- 判断音乐是否值得在后续版本继续加强。

Payload:

- `style`
- `praiseId`
- `musicTitle`
- `musicFile`

### Music Pause Clicks

Event: `music_pause_click`

Purpose:

- 观察用户播放后是否快速暂停。
- 辅助判断音乐是否打扰阅读。

Payload:

- `style`
- `praiseId`
- `musicTitle`
- `musicFile`

### Music Changes

Event: `music_change`

Purpose:

- 确认 `换一句` 或切换风格时，音乐与赞美是否同步变化。
- 观察用户实际听到的音乐切换路径。

Payload:

- `fromMusicTitle`
- `toMusicTitle`
- `fromMusicFile`
- `toMusicFile`
- `reason`

## Suggested V2 KPIs

- 换一句点击率 = `praise_next_click / page_view`
- 平均赞美浏览数 = `praise_impression / page_view`
- 风格切换率 = `praise_style_click / page_view`
- 音乐播放率 = `music_play_click / page_view`
- 播放后暂停率 = `music_pause_click / music_play_click`
- 最受欢迎风格 = `praise_impression` 或 `praise_style_click` 按 `style` 聚合

## Current Implementation

事件会进入 `window.dataLayer`，同时通过浏览器事件 `dailyPraiseAnalytics` 暴露，并在 `analytics-config.js` 启用 PostHog 后发送到 PostHog。

当前实现只发送显式产品事件，不依赖 PostHog autocapture。

## Enable PostHog

在 PostHog 项目中复制 Project API Key 和 Host，填入 `analytics-config.js`：

```js
window.DAILY_PRAISE_ANALYTICS = {
  posthog: {
    enabled: true,
    projectApiKey: "YOUR_POSTHOG_PROJECT_API_KEY",
    apiHost: "https://us.i.posthog.com"
  }
};
```

如果项目在 EU 区域，Host 使用 `https://eu.i.posthog.com`。

## Future Paid Events

V2 暂不实现付费，但可以在未来新增：

- `paid_next_prompt_view`
- `paid_next_click`
- `payment_start`
- `payment_success`
- `payment_failed`
