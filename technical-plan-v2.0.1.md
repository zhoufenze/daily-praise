# 夸夸 V2.0.1 Technical Plan

## Decision

V2.0.1 Phase A 后端选用腾讯云 CloudBase。

前端继续部署在 GitHub Pages，CloudBase 负责：

- 手机号验证码登录
- 用户身份认证
- 用户数据存储
- 每日免费次数记录
- 登录赠送次数记录
- 服务端扣次数
- 次数流水
- 订单结构预留

## Current CloudBase Setup

创建状态：已完成基础配置。

环境信息：

- 环境名称：`kuakua`
- 环境 ID：`kuakua-d6gh7a5yqca535d62`
- 地域：上海
- 运行环境：Node.js 18.15

身份认证：

- 手机号短信验证码登录：已启用
- 用户名密码登录：已启用，暂不作为主路径
- 匿名登录：未启用

数据库集合：

- `users_profile`
- `user_balances`
- `daily_usage`
- `credit_transactions`
- `orders`

集合权限：

- 5 个集合均设置为 `无权限 [ADMINONLY]`
- 前端不能直接读写这些集合
- 读写必须通过云函数完成

云函数：

- `getQuotaStatus`
- `grantLoginBonus`
- `consumePraiseCredit`

当前云函数状态：

- 3 个函数均已创建
- 状态正常
- 本地业务代码已准备在 `cloudfunctions/`
- 控制台代码已完成覆盖部署
- 控制台测试已验证 `getQuotaStatus`、`consumePraiseCredit` 可正常返回
- `grantLoginBonus` 未登录时返回 `login_required`，符合预期

## Why CloudBase

Phase A 的关键能力是手机号轻登录和次数记录。CloudBase 提供身份认证、云函数、云数据库，适合当前轻会员 MVP。

相比 LeanCloud / Supabase / Firebase：

- LeanCloud 存在停服风险，不再采用。
- CloudBase 更贴近国内手机号和中文产品场景。
- CloudBase 后续接微信生态更自然。
- CloudBase 能用云函数承载安全扣次数逻辑。
- 前端仍可继续放在 GitHub Pages。

## Region Requirement

CloudBase 手机号验证码登录能力仅支持上海地域。

因此创建 CloudBase 环境时必须选择：

```text
上海
```

不要选择广州、北京、新加坡等其他地域。

如果地域选错，可能出现：

- 控制台无法开启手机号验证码登录
- SDK 调用手机号登录失败
- 后续需要重新创建环境并迁移数据

## Architecture

```text
GitHub Pages
  index.html / style.css / script.js
        |
        | CloudBase Web SDK
        v
CloudBase Authentication
  手机号验证码登录
        |
        v
CloudBase Cloud Functions
  getQuotaStatus
  consumePraiseCredit
  grantLoginBonus
        |
        v
CloudBase Database
  users_profile
  user_balances
  daily_usage
  credit_transactions
  orders
```

## Frontend Responsibilities

前端负责：

- 展示登录入口
- 调起手机号验证码发送
- 提交验证码完成登录
- 展示剩余次数状态
- 点击 `换一句` 前请求后端扣次数
- 扣次数成功后再切换赞美和音乐
- 发送 PostHog 埋点

前端不负责：

- 自己修改用户余额
- 自己决定是否赠送登录次数
- 自己写入次数流水
- 自己创建订单
- 保存 CloudBase 管理端密钥

## Backend Responsibilities

CloudBase 云函数负责：

- 校验当前用户身份
- 查询每日免费次数
- 查询登录赠送次数
- 按规则扣减次数
- 写入次数流水
- 返回前端可用次数状态

## Database Collections

### users_profile

记录业务侧用户资料。

字段建议：

- `_id`
- `uid`
- `phone`
- `loginMethods`
- `firstLoginBonusGranted`
- `lastLoginAt`
- `status`
- `createdAt`
- `updatedAt`

说明：

- `uid` 使用 CloudBase 身份认证返回的用户标识。
- `firstLoginBonusGranted` 用于避免重复发放 10 次登录赠送次数。
- 手机号属于敏感信息，不发送到 PostHog。

### user_balances

记录用户账户次数。

字段：

- `_id`
- `uid`
- `bonusCredits`
- `paidCredits`
- `createdAt`
- `updatedAt`

初始值：

- `bonusCredits = 0`
- `paidCredits = 0`

### daily_usage

记录每日免费次数。

字段：

- `_id`
- `uid`
- `anonymousId`
- `dateKey`
- `freeLimit`
- `freeUsed`
- `createdAt`
- `updatedAt`

规则：

- 未登录用户用 `anonymousId + dateKey` 记录。
- 登录用户用 `uid + dateKey` 记录。
- Phase A 的每日免费次数为 `3`。

### credit_transactions

记录次数变化流水。

字段：

- `_id`
- `uid`
- `anonymousId`
- `type`
- `amount`
- `balanceType`
- `balanceAfter`
- `reason`
- `relatedOrderId`
- `createdAt`

`type` 可选：

- `grant`
- `consume`
- `refund`
- `purchase`

`balanceType` 可选：

- `daily_free`
- `bonus`
- `paid`

### orders

V2.0.1 暂不真实支付，只预留。

字段：

- `_id`
- `uid`
- `orderType`
- `amountCents`
- `credits`
- `status`
- `paymentProvider`
- `providerOrderId`
- `paidAt`
- `createdAt`
- `updatedAt`

`status` 可选：

- `pending`
- `paid`
- `failed`
- `cancelled`
- `refunded`

## Cloud Functions

### getQuotaStatus

用途：

- 页面加载后查询当前次数状态。
- 登录后刷新次数状态。

输入：

```json
{
  "anonymousId": "daily-praise-xxx",
  "dateKey": "2026-05-09"
}
```

输出：

```json
{
  "isLoggedIn": true,
  "freeLimit": 3,
  "freeUsed": 1,
  "freeRemaining": 2,
  "bonusCredits": 10,
  "paidCredits": 0,
  "canChangePraise": true
}
```

### grantLoginBonus

用途：

- 用户首次登录后赠送 10 次。
- 只允许每个用户发放一次。

触发时机：

- 手机号登录成功后前端调用。
- 或在后续版本使用云函数集中处理登录后初始化。

规则：

- 如果 `firstLoginBonusGranted = true`，不重复发放。
- 如果未发放，则 `bonusCredits += 10`。
- 写入 `credit_transactions`。

### consumePraiseCredit

用途：

- 用户点击 `换一句` 时扣次数。
- 扣成功后前端才切换赞美和音乐。

输入：

```json
{
  "anonymousId": "daily-praise-xxx",
  "dateKey": "2026-05-09",
  "currentPraiseId": "warm-morning-01"
}
```

扣减顺序：

1. 当日免费次数
2. 登录赠送次数
3. 未来充值次数

输出成功：

```json
{
  "allowed": true,
  "consumedFrom": "daily_free",
  "freeRemaining": 2,
  "bonusCredits": 10,
  "paidCredits": 0
}
```

输出失败：

```json
{
  "allowed": false,
  "reason": "quota_exhausted",
  "shouldPromptLogin": true
}
```

## Phone Login Flow

### Step 1: Request SMS Code

用户输入手机号后，请求验证码。

前端事件：

- `phone_login_start`
- `sms_code_request`

错误情况：

- 手机号格式错误
- 发送过于频繁
- 短信服务额度不足
- CloudBase 环境地域不是上海

### Step 2: Verify Code and Login

用户输入验证码后完成登录。

成功后：

- 调用 `grantLoginBonus`
- 调用 `getQuotaStatus`
- 关闭登录弹窗
- 发送 `phone_login_success`

失败后：

- 展示验证码错误提示
- 发送 `phone_login_failed`

## Quota Flow

### Page Load

1. 创建或读取本地 `anonymousId`
2. 生成 `dateKey`
3. 先渲染当天默认赞美和音乐
4. 后台加载并初始化 CloudBase Web SDK
5. 调用 `getQuotaStatus`
6. 渲染剩余次数提示

说明：

- CloudBase SDK 不作为阻塞脚本直接写在 HTML 中。
- 如果 SDK 网络加载变慢，用户仍能先看到默认夸夸内容。
- 本地预览环境下，如果 CloudBase SDK 或授权域名不可用，会临时使用浏览器本地次数方便调试 UI。

### Click Next

1. 用户点击 `换一句`
2. 前端调用 `consumePraiseCredit`
3. 如果 `allowed = true`
   - 切换赞美
   - 切换音乐
   - 更新次数状态
   - 发送 `praise_next_click`
4. 如果 `allowed = false`
   - 未登录：展示登录弹窗
   - 已登录：展示次数用完提示

## UI Changes

### Header

增加轻会员入口：

- 未登录：`登录`
- 已登录：展示 `剩余 X 次`

### Login Modal

手机号登录字段：

- 手机号输入框
- 获取验证码按钮
- 验证码输入框
- 登录按钮

微信登录入口先保留位置，但 Phase A 可暂不接入真实能力：

- PC：`微信扫码登录`
- 微信内：`微信授权登录`
- 手机外部浏览器：弱化展示

### Quota Hint

建议轻量展示：

- 未登录且有次数：`今日还可换 2 次`
- 未登录次数用完：`登录后继续获得更多夸夸`
- 已登录：`剩余 12 次`

## Analytics Events

新增事件：

- `login_button_click`
- `login_prompt_view`
- `login_prompt_close`
- `phone_login_start`
- `sms_code_request`
- `sms_code_request_success`
- `sms_code_request_failed`
- `phone_login_success`
- `phone_login_failed`
- `login_bonus_granted`
- `quota_status_loaded`
- `free_quota_used`
- `bonus_credit_used`
- `quota_exhausted`

关键属性：

- `isLoggedIn`
- `freeRemaining`
- `bonusCredits`
- `paidCredits`
- `consumedFrom`
- `reason`
- `loginMethod`

## Security Rules

必须遵守：

- 不在前端保存 CloudBase 管理端密钥
- 不允许前端直接修改 `user_balances`
- 不允许前端直接创建 `credit_transactions`
- 扣次数必须走云函数
- 云函数内部完成余额修改和流水写入
- 手机号、openid 等敏感信息不发送到 PostHog

## Deployment Plan

### 1. CloudBase Setup

- 创建腾讯云 CloudBase 环境：已完成
- 地域选择上海：已完成
- 记录环境 ID：已完成
- 开启身份认证：已完成
- 开启手机号验证码登录：已完成
- 创建数据库集合：已完成

### 2. Cloud Functions

- 创建 `getQuotaStatus`：已完成
- 创建 `grantLoginBonus`：已完成
- 创建 `consumePraiseCredit`：已完成
- 准备本地云函数代码：已完成
- 部署云函数：已完成
- 配置云函数权限：已完成
- 控制台函数测试：已完成

### 3. Frontend Integration

- 引入 CloudBase Web SDK：已完成
- 新增 `membership-config.js`：已完成
- 新增登录弹窗：已完成
- 接入手机号验证码流程：已完成
- 修改 `换一句` 为先扣次数再切换内容：已完成
- 保留 V2 音乐和赞美逻辑：已完成

前端公开配置：

```js
window.KUAKUA_MEMBERSHIP = {
  cloudbase: {
    enabled: true,
    envId: "kuakua-d6gh7a5yqca535d62"
  }
};
```

说明：

- `envId` 是公开环境标识，可以放在前端。
- 不要在前端放服务端 API Key、SecretId、SecretKey。
- 如果后续 CloudBase 要求配置客户端 Publishable Key，再补充到 `membership-config.js`。

### 4. Testing

测试场景：

- 未登录首次打开
- 未登录点击 3 次后弹登录
- 手机号验证码登录成功
- 首次登录赠送 10 次
- 登录后继续换一句消耗赠送次数
- 刷新页面后次数不丢
- 第二天每日免费次数重置

## Phase A Acceptance Criteria

V2.0.1-A 完成标准：

- 用户可以用手机号验证码登录
- 未登录用户每天可免费换 3 次
- 免费次数用完后出现登录引导
- 首次登录用户获得 10 次赠送次数
- 点击 `换一句` 会服务端扣次数
- 次数不足时不能继续换一句
- PostHog 能看到登录和次数事件
- 当前 V2 的赞美、音乐、风格切换体验不被破坏

## Deferred to Phase B

暂缓：

- 微信扫码登录
- 微信内网页授权登录
- openid / unionid 绑定
- 手机号与微信账号合并

## Official References

- CloudBase 身份认证：
  https://docs.cloudbase.net/service/authentication
- CloudBase 登录认证 Web SDK：
  https://docs.cloudbase.net/api-reference/webv1/authentication
- CloudBase 登录方式管理：
  https://docs.cloudbase.net/authentication-v2/auth/manage-login
- CloudBase 云函数：
  https://docs.cloudbase.net/service/functions
- CloudBase 云数据库：
  https://docs.cloudbase.net/service/database
