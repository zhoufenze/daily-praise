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

The MVP is ready for PostHog Free.

Events are pushed into `window.dataLayer`, emitted through a browser event named `dailyPraiseAnalytics`, and sent to PostHog when PostHog is enabled in `analytics-config.js`.

PostHog is disabled by default until a project API key is added.

## Enable PostHog

Create a PostHog project, then copy the project API key and host into `analytics-config.js`:

```js
window.DAILY_PRAISE_ANALYTICS = {
  posthog: {
    enabled: true,
    projectApiKey: "YOUR_POSTHOG_PROJECT_API_KEY",
    apiHost: "https://us.i.posthog.com"
  }
};
```

Use `https://eu.i.posthog.com` instead if the PostHog project is hosted in the EU region.

## Privacy Notes

The current implementation disables PostHog autocapture and sends only the explicit product events listed above.
