# 夸夸 V2.0.1 Requirements

## Version Positioning

V2.0.1 是 `夸夸` 的轻会员小迭代。

本版本目标不是马上商业化，而是验证：

- 用户是否愿意登录以获得更多 `换一句` 次数
- 每日免费次数是否能建立轻量使用习惯
- 后续充值、会员、付费换一句是否值得继续做

## Product Scope

V2.0.1 从纯静态网页升级为带用户身份和次数记录的小产品。

核心变化：

- 增加登录入口
- 增加每日免费次数规则
- 登录后赠送额外次数
- 后台记录用户、次数流水、订单预留数据
- 暂不接入真实支付

## Login Strategy

### 1. 手机号登录 / 注册作为主路径

手机号验证码登录 / 注册是 V2.0.1 的主账号方式。

原因：

- 适合 PC 和手机浏览器
- 不依赖用户是否在微信内打开
- 体验稳定
- 方便后续绑定充值、客服、订单查询

建议登录方式：

- 手机号 + 短信验证码

规则：

- 已注册手机号：直接完成验证码登录。
- 未注册手机号：自动切换到注册流程，提示用户重新获取注册验证码。
- 注册成功后自动登录，并领取一次性登录奖励次数。

登录后记录：

- 用户 ID
- 手机号
- 首次登录时间
- 最近登录时间
- 登录来源

### 2. 微信登录作为辅助路径

微信登录根据访问场景区分：

#### PC 网页端

使用微信扫码登录。

用户流程：

1. 用户点击 `微信登录`
2. 页面展示微信二维码
3. 用户使用微信扫码确认
4. 网站完成登录

需要能力：

- 微信开放平台网站应用
- AppID
- AppSecret
- 授权回调域名

#### 手机微信内置浏览器

使用微信公众号网页授权登录。

用户流程：

1. 用户在微信内打开网页
2. 点击 `微信登录`
3. 微信授权确认
4. 回到网站并完成登录

需要能力：

- 公众号
- 网页授权域名配置
- 获取用户 openid

#### 手机外部浏览器

优先展示手机号登录。

原因：

- 手机外部浏览器内的微信授权体验不稳定
- 用户可能需要跳转微信或扫码
- 手机号登录更直接

## Login UI Rules

### Desktop

默认展示：

- 手机号登录
- 微信扫码登录

### Mobile in WeChat

默认展示：

- 微信授权登录
- 手机号登录

### Mobile outside WeChat

默认展示：

- 手机号登录

微信登录可作为次要入口，但不作为主路径。

## Free Usage Rules

### Guest User

未登录用户每天可免费点击 `换一句` 3 次。

规则：

- 每天重置
- 使用浏览器本地记录作为基础限制
- 不保证强防刷
- 次数用完后，引导登录

建议提示：

> 今天的免费次数用完啦，登录后可以继续获得更多夸夸。

### Logged-in User

登录用户获得额外 10 次。

规则建议：

- 首次登录赠送 10 次
- 赠送次数记录到账户
- 每次点击 `换一句` 消耗 1 次
- 每日免费 3 次优先使用
- 每日免费次数用完后，再消耗账户赠送次数

### Count Priority

点击 `换一句` 时按以下顺序扣减：

1. 当日免费次数
2. 登录赠送次数
3. 未来充值次数

V2.0.1 暂不实现第 3 项真实充值。

## User States

### State 1: 未登录且仍有免费次数

用户可以正常点击 `换一句`。

页面可轻提示剩余次数，但不强制展示。

### State 2: 未登录且免费次数已用完

点击 `换一句` 后展示登录引导。

可用操作：

- 手机号登录
- 微信登录
- 关闭弹窗

### State 3: 已登录且仍有次数

用户可以继续点击 `换一句`。

系统记录每次消耗。

### State 4: 已登录但次数用完

展示次数用完提示。

V2.0.1 暂不展示支付入口，只保留后续扩展位。

建议提示：

> 今天的夸夸已经用完啦，明天还会有新的能量。

## Data Model Draft

### users

用于记录用户基础身份。

字段建议：

- `id`
- `phone`
- `wechat_openid`
- `wechat_unionid`
- `login_methods`
- `created_at`
- `last_login_at`
- `status`

### user_balances

用于记录用户剩余次数。

字段建议：

- `user_id`
- `bonus_credits`
- `paid_credits`
- `updated_at`

说明：

- `bonus_credits` 用于登录赠送次数
- `paid_credits` 为未来充值预留

### daily_usage

用于记录每日免费次数使用情况。

字段建议：

- `id`
- `user_id`
- `anonymous_id`
- `date`
- `free_limit`
- `free_used`
- `created_at`
- `updated_at`

说明：

- 未登录时使用 `anonymous_id`
- 登录后使用 `user_id`

### credit_transactions

用于记录次数变化流水。

字段建议：

- `id`
- `user_id`
- `type`
- `amount`
- `balance_after`
- `reason`
- `related_order_id`
- `created_at`

`type` 可选：

- `grant`
- `consume`
- `refund`
- `purchase`

### orders

V2.0.1 暂不真实支付，但先预留订单结构。

字段建议：

- `id`
- `user_id`
- `order_type`
- `amount_cents`
- `credits`
- `status`
- `payment_provider`
- `provider_order_id`
- `created_at`
- `paid_at`

`status` 可选：

- `pending`
- `paid`
- `failed`
- `cancelled`
- `refunded`

## Analytics Events

继续保留 V2 事件：

- `page_view`
- `praise_impression`
- `praise_next_click`
- `praise_style_click`
- `music_play_click`
- `music_pause_click`
- `music_change`

V2.0.1 新增建议事件：

- `login_prompt_view`
- `login_method_click`
- `phone_login_start`
- `phone_register_start`
- `phone_register_success`
- `phone_register_failed`
- `phone_login_success`
- `wechat_login_start`
- `wechat_login_success`
- `free_quota_used`
- `bonus_credit_used`
- `quota_exhausted`

关键指标：

- 登录转化率 = `phone_login_success + wechat_login_success / login_prompt_view`
- 免费次数耗尽率 = `quota_exhausted / page_view`
- 登录后继续使用率 = 登录后 `praise_next_click / login_success`
- 手机号登录占比
- 微信登录占比

## Technical Direction

V2.0.1 不再适合只用 GitHub Pages 完成全部能力。

需要新增：

- 腾讯云 CloudBase
- 用户表
- 次数表
- 短信验证码能力
- 微信登录回调能力
- 安全的服务端扣次数逻辑

### Backend Platform Decision

V2.0.1-A 后端平台改为腾讯云 CloudBase。

原因：

- LeanCloud 存在停服风险，不再作为候选方案。
- CloudBase 更适合中文网页、国内手机号和后续微信生态能力。
- CloudBase 提供身份认证、云函数、云数据库，可以覆盖轻会员 MVP。
- 前端仍然可以继续部署在 GitHub Pages，不需要推翻当前静态网页。

重要限制：

- CloudBase 手机号验证码登录能力仅支持上海地域。
- 创建 CloudBase 环境时必须选择上海地域。
- 如果选错地域，后续可能无法开启手机号验证码登录，需要重新建环境。

### Recommended Implementation Path

#### Phase A: 手机号轻会员

优先完成：

- 手机号验证码登录
- 每日 3 次免费
- 登录赠送 10 次
- 服务端记录次数
- PostHog 记录登录和次数事件

目标：

- 快速验证用户是否愿意登录
- 不被微信配置卡住进度

#### Phase B: 微信登录

在 Phase A 跑通后补充：

- PC 微信扫码登录
- 微信内网页授权登录
- 微信 openid / unionid 绑定现有用户

目标：

- 提升登录便利性
- 为后续微信生态传播做准备

#### Phase C: 充值预留

暂不接真实支付，只预留：

- 订单表
- 次数流水
- 支付状态字段
- 前端次数用完状态

## Out of Scope

V2.0.1 暂不实现：

- 真实充值
- 微信支付
- 支付宝支付
- 会员包月
- 邮箱登录
- 复杂用户中心
- 后台管理系统
- 严格反作弊
- App 或小程序版本

## Open Questions

1. 微信登录是否要在 V2.0.1-A 同时接入，还是放到 V2.0.1-B？
2. 登录赠送 10 次是永久一次性赠送，还是每次登录都赠送？
3. 未登录用户的 3 次限制是否允许被清缓存绕过？
4. CloudBase 环境名、环境 ID 使用什么命名？
5. 手机号验证码短信签名和模板如何设置？

## Current Recommendation

建议 V2.0.1 先做 `Phase A: 手机号轻会员`，后端使用腾讯云 CloudBase。

原因：

- 交付最快
- 风险最低
- 不依赖微信开放平台审核和配置
- 能尽快验证用户是否愿意登录
- 与后续微信登录、微信生态传播的技术路线更一致

微信登录建议作为第二步补上。
