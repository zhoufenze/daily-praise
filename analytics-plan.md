# Daily Praise Analytics Plan

## Goal

After launch, the product should be able to measure whether users notice and use the core actions.

## Core Metrics

### Page Views

Event: `page_view`

Purpose:

- Count how many times the page is opened.
- Estimate basic traffic.

### Praise Impressions

Event: `praise_impression`

Purpose:

- Count how many compliments are shown.
- Understand which style is viewed most often.

Payload:

- `style`
- `praiseText`
- `praiseIndex`

### Next Button Clicks

Event: `praise_next_click`

Purpose:

- Measure how often users click `Another one`.
- This is the main click-through metric for V1.

Payload:

- `style`
- `previousPraiseText`

### Style Switch Clicks

Event: `praise_style_click`

Purpose:

- Measure whether users explore different praise styles.
- Compare style preference.

Payload:

- `fromStyle`
- `toStyle`

## Suggested V1 KPIs

- Next button CTR = `praise_next_click / page_view`
- Average compliments viewed per visit = `praise_impression / page_view`
- Style switch rate = `praise_style_click / page_view`
- Most selected style = top `toStyle` from `praise_style_click`

## Current Implementation

The MVP does not send data to a real analytics service yet.

Events are pushed into `window.dataLayer` and also emitted through a browser event named `dailyPraiseAnalytics`.

This keeps the MVP privacy-friendly and dependency-free while making future integration simple.

## Future Integration Options

The `trackEvent` function in `script.js` can later be connected to:

- Google Analytics
- PostHog
- Plausible
- Baidu Analytics
- A custom backend endpoint

