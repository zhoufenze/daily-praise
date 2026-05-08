const praiseLibrary = {
  warm: {
    label: "Warm style",
    lines: [
      "You make ordinary moments feel quietly brighter.",
      "You bring a steady kind of good energy.",
      "Your presence makes people feel a little more at ease.",
      "You have a gentle way of making the day feel lighter.",
      "People feel safe being themselves around you.",
      "You add warmth without even trying too hard.",
      "Your kindness has a calm kind of strength.",
      "You make small moments feel worth noticing."
    ]
  },
  professional: {
    label: "Professional style",
    lines: [
      "Your clarity helps people trust the next step.",
      "You make complex things feel easier to understand.",
      "Your professionalism shows up in the details.",
      "You have a reliable way of bringing order to busy moments.",
      "People can feel the care behind your work.",
      "Your focus makes the whole conversation more useful.",
      "You communicate with a confidence that feels grounded.",
      "You make progress feel practical and possible."
    ]
  },
  funny: {
    label: "Funny style",
    lines: [
      "You are basically a mood upgrade with shoes.",
      "Your good energy deserves its own tiny parade.",
      "You make awkward moments file a formal complaint and leave.",
      "Your charm has excellent timing.",
      "You are proof that useful and delightful can share a desk.",
      "You bring the kind of vibe coffee wishes it had.",
      "Your brain has a surprisingly good user interface.",
      "You make today feel less like a Monday, even when it is one."
    ]
  },
  smart: {
    label: "Emotionally smart style",
    lines: [
      "You notice the feeling underneath the words.",
      "You have a rare talent for making people feel respected.",
      "Your listening turns conversations into calmer places.",
      "You respond with care, not just speed.",
      "You understand people in a way that makes trust easier.",
      "You know how to be honest without making things harsh.",
      "Your empathy has structure, and that is powerful.",
      "You help people feel seen without putting them on the spot."
    ]
  }
};

const quoteText = document.querySelector("#quoteText");
const styleLabel = document.querySelector("#styleLabel");
const praiseCard = document.querySelector("#praiseCard");
const nextButton = document.querySelector("#nextButton");
const todayLabel = document.querySelector("#todayLabel");
const styleButtons = Array.from(document.querySelectorAll("[data-style]"));

let activeStyle = "warm";
let lastLine = "";
let praiseCount = 0;

function getAnalyticsConfig() {
  return window.DAILY_PRAISE_ANALYTICS || {};
}

function getDistinctId() {
  const storageKey = "daily_praise_distinct_id";
  const existingId = window.localStorage.getItem(storageKey);

  if (existingId) {
    return existingId;
  }

  const nextId = crypto.randomUUID
    ? crypto.randomUUID()
    : `daily-praise-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(storageKey, nextId);
  return nextId;
}

function capturePostHogEvent(name, properties) {
  const config = getAnalyticsConfig().posthog;

  if (!config?.enabled || !config.projectApiKey || !config.apiHost) {
    return;
  }

  const eventBody = JSON.stringify({
    api_key: config.projectApiKey,
    event: name,
    properties: {
      distinct_id: getDistinctId(),
      $current_url: window.location.href,
      $host: window.location.host,
      $pathname: window.location.pathname,
      ...properties
    }
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${config.apiHost}/capture/`, eventBody);
    return;
  }

  fetch(`${config.apiHost}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: eventBody,
    keepalive: true
  }).catch((error) => {
    window.dispatchEvent(
      new CustomEvent("dailyPraiseAnalyticsError", {
        detail: {
          provider: "posthog",
          message: error instanceof Error ? error.message : "PostHog capture failed"
        }
      })
    );
  });
}

function trackEvent(name, details = {}) {
  const payload = {
    event: name,
    page: "daily_praise_mvp",
    timestamp: new Date().toISOString(),
    ...details
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  capturePostHogEvent(name, payload);
  window.dispatchEvent(new CustomEvent("dailyPraiseAnalytics", { detail: payload }));
}

function pickPraise(style) {
  const lines = praiseLibrary[style].lines;
  const availableLines = lines.filter((line) => line !== lastLine);
  const source = availableLines.length > 0 ? availableLines : lines;
  const index = Math.floor(Math.random() * source.length);

  return source[index];
}

function renderPraise(style) {
  const praise = pickPraise(style);

  lastLine = praise;
  praiseCount += 1;
  styleLabel.textContent = praiseLibrary[style].label;
  quoteText.textContent = praise;

  praiseCard.classList.remove("refreshing");
  void praiseCard.offsetWidth;
  praiseCard.classList.add("refreshing");

  trackEvent("praise_impression", {
    style,
    praiseText: praise,
    praiseIndex: praiseCount
  });
}

function setActiveStyle(style) {
  activeStyle = style;

  styleButtons.forEach((button) => {
    const isActive = button.dataset.style === style;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderPraise(style);
}

function setTodayLabel() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  todayLabel.textContent = formatter.format(new Date());
}

nextButton.addEventListener("click", () => {
  trackEvent(nextButton.dataset.analyticsEvent, {
    style: activeStyle,
    previousPraiseText: lastLine
  });
  renderPraise(activeStyle);
});

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackEvent(button.dataset.analyticsEvent, {
      fromStyle: activeStyle,
      toStyle: button.dataset.style
    });
    setActiveStyle(button.dataset.style);
  });
});

function initApp() {
  setTodayLabel();
  trackEvent("page_view");
  renderPraise(activeStyle);
}

initApp();
