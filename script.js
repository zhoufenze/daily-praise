const praiseLibrary = {
  warm: {
    label: "温暖型",
    items: [
      {
        id: "warm-morning-01",
        praise: "你已经很努力了，今天值得被温柔地肯定。",
        musicTitle: "Nostalgic Piano",
        musicMood: "温柔、舒缓、像被轻轻接住",
        musicFile: "./music/atlasaudio-nostalgic-piano-520047.mp3"
      },
      {
        id: "warm-sunny-02",
        praise: "你身上有一种让人安心的力量，靠近你会觉得世界慢了一点。",
        musicTitle: "Nostalgic Piano",
        musicMood: "温柔、舒缓、像被轻轻接住",
        musicFile: "./music/atlasaudio-nostalgic-piano-520047.mp3"
      },
      {
        id: "warm-spark-03",
        praise: "你把平凡的一天照顾得很好，这本身就很了不起。",
        musicTitle: "Nostalgic Piano",
        musicMood: "温柔、舒缓、像被轻轻接住",
        musicFile: "./music/atlasaudio-nostalgic-piano-520047.mp3"
      }
    ]
  },
  professional: {
    label: "专业型",
    items: [
      {
        id: "pro-clear-01",
        praise: "你的表达很清楚，让复杂的事情也变得可以推进。",
        musicTitle: "Piano Moment",
        musicMood: "清晰、沉稳、适合把事情做好",
        musicFile: "./music/good_b_music-piano-moment-9835.mp3"
      },
      {
        id: "pro-start-02",
        praise: "你做事有分寸，也有判断力，这会让人很自然地信任你。",
        musicTitle: "Piano Moment",
        musicMood: "清晰、沉稳、适合把事情做好",
        musicFile: "./music/good_b_music-piano-moment-9835.mp3"
      },
      {
        id: "pro-confidence-03",
        praise: "你的可靠不是靠声音变大，而是靠每个细节都站得住。",
        musicTitle: "Piano Moment",
        musicMood: "清晰、沉稳、适合把事情做好",
        musicFile: "./music/good_b_music-piano-moment-9835.mp3"
      }
    ]
  },
  funny: {
    label: "幽默型",
    items: [
      {
        id: "funny-bounce-01",
        praise: "你今天的状态像给空气加了点糖，连路过的烦恼都想绕路。",
        musicTitle: "Nostalgic",
        musicMood: "轻松、明亮、带一点会心一笑",
        musicFile: "./music/monume-nostalgic-509444.mp3"
      },
      {
        id: "funny-parade-02",
        praise: "你这种好能量，建议申请一个小型庆祝仪式。",
        musicTitle: "Nostalgic",
        musicMood: "轻松、明亮、带一点会心一笑",
        musicFile: "./music/monume-nostalgic-509444.mp3"
      },
      {
        id: "funny-walk-03",
        praise: "你不只是把事情做好，还顺手把气氛调亮了。",
        musicTitle: "Nostalgic",
        musicMood: "轻松、明亮、带一点会心一笑",
        musicFile: "./music/monume-nostalgic-509444.mp3"
      }
    ]
  },
  smart: {
    label: "高情商型",
    items: [
      {
        id: "smart-spark-01",
        praise: "你很会照顾别人的感受，而且不会丢掉自己的边界。",
        musicTitle: "Piano Piano Music",
        musicMood: "细腻、真诚、适合慢慢被理解",
        musicFile: "./music/paulyudin-piano-piano-music-508963.mp3"
      },
      {
        id: "smart-light-02",
        praise: "你能听见话里的情绪，这是一种很珍贵的能力。",
        musicTitle: "Piano Piano Music",
        musicMood: "细腻、真诚、适合慢慢被理解",
        musicFile: "./music/paulyudin-piano-piano-music-508963.mp3"
      },
      {
        id: "smart-confidence-03",
        praise: "你说话让人舒服，不是因为讨好，而是因为真诚又有尺度。",
        musicTitle: "Piano Piano Music",
        musicMood: "细腻、真诚、适合慢慢被理解",
        musicFile: "./music/paulyudin-piano-piano-music-508963.mp3"
      }
    ]
  }
};

const quoteText = document.querySelector("#quoteText");
const styleLabel = document.querySelector("#styleLabel");
const praiseCard = document.querySelector("#praiseCard");
const nextButton = document.querySelector("#nextButton");
const todayLabel = document.querySelector("#todayLabel");
const styleButtons = Array.from(document.querySelectorAll("[data-style]"));
const musicButton = document.querySelector("#musicButton");
const musicButtonIcon = document.querySelector("#musicButtonIcon");
const musicPlayer = document.querySelector("#musicPlayer");
const musicTitle = document.querySelector("#musicTitle");
const musicMood = document.querySelector("#musicMood");

const allPraiseItems = Object.entries(praiseLibrary).flatMap(([style, group]) =>
  group.items.map((item, index) => ({ ...item, style, styleIndex: index }))
);

let activeStyle = "warm";
let activeItem = null;
let activeStyleIndex = 0;
let praiseCount = 0;
let isMusicPlaying = false;

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

  fetch(`${config.apiHost}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: eventBody,
    keepalive: true
  }).catch((error) => {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${config.apiHost}/capture/`, eventBody);
    }

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
    page: "kuakua_v2",
    timestamp: new Date().toISOString(),
    ...details
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  capturePostHogEvent(name, payload);
  window.dispatchEvent(new CustomEvent("dailyPraiseAnalytics", { detail: payload }));
}

function getDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value) {
  return Array.from(value).reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 7);
}

function getDailyItem() {
  const dailyIndex = hashString(getDateKey()) % allPraiseItems.length;
  return allPraiseItems[dailyIndex];
}

function getDailyStyleIndex(style) {
  const items = praiseLibrary[style].items;
  return hashString(`${getDateKey()}-${style}`) % items.length;
}

function getItemByStyleIndex(style, index) {
  const item = praiseLibrary[style].items[index];
  return { ...item, style, styleIndex: index };
}

function setStyleButtonState(style) {
  styleButtons.forEach((button) => {
    const isActive = button.dataset.style === style;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateMusicButton() {
  musicButtonIcon.textContent = isMusicPlaying ? "Ⅱ" : "▶";
  musicButton.setAttribute("aria-label", isMusicPlaying ? "暂停音乐" : "播放音乐");
  musicButton.dataset.analyticsEvent = isMusicPlaying ? "music_pause_click" : "music_play_click";
  praiseCard.classList.toggle("is-playing", isMusicPlaying);
}

function playCurrentMusic() {
  isMusicPlaying = true;
  updateMusicButton();

  const playPromise = musicPlayer.play();

  if (playPromise) {
    playPromise.catch(() => {
      isMusicPlaying = false;
      updateMusicButton();
    });
  }
}

function pauseCurrentMusic() {
  musicPlayer.pause();
  isMusicPlaying = false;
  updateMusicButton();
}

function renderPraise(item, reason = "render") {
  const previousItem = activeItem;

  activeItem = item;
  activeStyle = item.style;
  activeStyleIndex = item.styleIndex;
  praiseCount += 1;

  styleLabel.textContent = praiseLibrary[item.style].label;
  quoteText.textContent = item.praise;
  musicTitle.textContent = item.musicTitle;
  musicMood.textContent = item.musicMood;

  const shouldResumeMusic = isMusicPlaying;
  musicPlayer.src = item.musicFile;
  musicPlayer.load();

  if (shouldResumeMusic) {
    playCurrentMusic();
  }

  setStyleButtonState(item.style);

  praiseCard.classList.remove("refreshing");
  void praiseCard.offsetWidth;
  praiseCard.classList.add("refreshing");

  if (previousItem && previousItem.musicFile !== item.musicFile) {
    trackEvent("music_change", {
      fromMusicTitle: previousItem.musicTitle,
      toMusicTitle: item.musicTitle,
      fromMusicFile: previousItem.musicFile,
      toMusicFile: item.musicFile,
      reason
    });
  }

  trackEvent("praise_impression", {
    style: item.style,
    praiseId: item.id,
    praiseText: item.praise,
    praiseIndex: praiseCount,
    musicTitle: item.musicTitle,
    musicFile: item.musicFile,
    reason
  });
}

function setActiveStyle(style) {
  const styleIndex = getDailyStyleIndex(style);
  renderPraise(getItemByStyleIndex(style, styleIndex), "style_change");
}

function setTodayLabel() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  todayLabel.textContent = formatter.format(new Date());
}

nextButton.addEventListener("click", () => {
  const previousItem = activeItem;
  const nextIndex = (activeStyleIndex + 1) % praiseLibrary[activeStyle].items.length;

  trackEvent(nextButton.dataset.analyticsEvent, {
    style: activeStyle,
    previousPraiseId: previousItem?.id,
    previousPraiseText: previousItem?.praise,
    previousMusicTitle: previousItem?.musicTitle,
    nextStyleIndex: nextIndex
  });

  renderPraise(getItemByStyleIndex(activeStyle, nextIndex), "next_click");
});

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextStyle = button.dataset.style;

    trackEvent(button.dataset.analyticsEvent, {
      fromStyle: activeStyle,
      toStyle: nextStyle,
      previousPraiseId: activeItem?.id
    });

    setActiveStyle(nextStyle);
  });
});

musicButton.addEventListener("click", () => {
  const eventName = musicButton.dataset.analyticsEvent;

  if (isMusicPlaying) {
    pauseCurrentMusic();
  } else {
    playCurrentMusic();
  }

  trackEvent(eventName, {
    style: activeStyle,
    praiseId: activeItem?.id,
    musicTitle: activeItem?.musicTitle,
    musicFile: activeItem?.musicFile
  });
});

function initApp() {
  setTodayLabel();
  trackEvent("page_view", {
    dateKey: getDateKey()
  });
  renderPraise(getDailyItem(), "daily_default");
  updateMusicButton();
}

initApp();
