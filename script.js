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
const quotaPill = document.querySelector("#quotaPill");
const loginButton = document.querySelector("#loginButton");
const loginModal = document.querySelector("#loginModal");
const loginForm = document.querySelector("#loginForm");
const loginTitle = document.querySelector("#loginTitle");
const loginDescription = document.querySelector("#loginDescription");
const authModeButton = document.querySelector("#authModeButton");
const phoneInput = document.querySelector("#phoneInput");
const codeInput = document.querySelector("#codeInput");
const sendCodeButton = document.querySelector("#sendCodeButton");
const loginSubmitButton = document.querySelector("#loginSubmitButton");
const loginMessage = document.querySelector("#loginMessage");
const loginSuccess = document.querySelector("#loginSuccess");
const loginSuccessTitle = document.querySelector("#loginSuccessTitle");
const loginSuccessText = document.querySelector("#loginSuccessText");
const loginContinueButton = document.querySelector("#loginContinueButton");
const statusToast = document.querySelector("#statusToast");

const allPraiseItems = Object.entries(praiseLibrary).flatMap(([style, group]) =>
  group.items.map((item, index) => ({ ...item, style, styleIndex: index }))
);

const membershipState = {
  app: null,
  auth: null,
  enabled: false,
  initialized: false,
  isLoggedIn: false,
  quota: null,
  otpVerifier: null,
  authMode: "login",
  otpMode: "login",
  lastError: "",
  localFallback: false,
  isAuthSubmitting: false
};

let activeStyle = "warm";
let activeItem = null;
let activeStyleIndex = 0;
let praiseCount = 0;
let isMusicPlaying = false;
let isNextLoading = false;
let statusToastTimer = 0;

function getAnalyticsConfig() {
  return window.DAILY_PRAISE_ANALYTICS || {};
}

function getMembershipConfig() {
  return window.KUAKUA_MEMBERSHIP?.cloudbase || {};
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
    page: "kuakua_v2_0_1",
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

function getNextItem() {
  const nextIndex = (activeStyleIndex + 1) % praiseLibrary[activeStyle].items.length;
  return getItemByStyleIndex(activeStyle, nextIndex);
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

function normalizeQuota(result = {}) {
  return {
    ok: result.ok !== false,
    isLoggedIn: Boolean(result.isLoggedIn),
    freeLimit: Number(result.freeLimit ?? 3),
    freeUsed: Number(result.freeUsed ?? 0),
    freeRemaining: Number(result.freeRemaining ?? 0),
    bonusCredits: Number(result.bonusCredits ?? 0),
    paidCredits: Number(result.paidCredits ?? 0),
    canChangePraise: result.canChangePraise !== false,
    reason: result.reason || "",
    shouldPromptLogin: Boolean(result.shouldPromptLogin)
  };
}

function getTotalRemaining(quota = membershipState.quota) {
  if (!quota) {
    return 0;
  }

  return quota.freeRemaining + quota.bonusCredits + quota.paidCredits;
}

function updateQuotaUi() {
  const quota = membershipState.quota;
  quotaPill.classList.toggle("is-warning", Boolean(quota && getTotalRemaining(quota) <= 0));
  loginButton.classList.toggle("is-logged-in", membershipState.isLoggedIn);

  if (!membershipState.initialized) {
    quotaPill.textContent = "次数加载中";
    nextButton.disabled = true;
    loginButton.disabled = false;
    return;
  }

  nextButton.disabled = isNextLoading || Boolean(quota && !quota.canChangePraise);

  if (membershipState.lastError && !quota) {
    quotaPill.textContent = membershipState.isLoggedIn ? "次数待同步" : "今日还可换 3 次";
    loginButton.textContent = membershipState.isLoggedIn ? "退出" : "登录";
    loginButton.disabled = false;
    return;
  }

  if (!quota) {
    quotaPill.textContent = "今日可换 3 次";
    loginButton.textContent = "登录";
    loginButton.disabled = false;
    return;
  }

  const totalRemaining = getTotalRemaining(quota);

  if (membershipState.isLoggedIn) {
    quotaPill.textContent = `剩余 ${totalRemaining} 次`;
    loginButton.textContent = "退出";
    loginButton.disabled = false;
    return;
  }

  quotaPill.textContent =
    totalRemaining > 0 ? `今日还可换 ${quota.freeRemaining} 次` : "登录后继续夸夸";
  loginButton.textContent = "登录";
  loginButton.disabled = false;
}

function setNextLoading(isLoading) {
  isNextLoading = isLoading;
  nextButton.disabled = isLoading;
  nextButton.setAttribute("aria-busy", String(isLoading));
  nextButton.querySelector(".button-icon").textContent = isLoading ? "…" : "↻";
}

function isLocalPreview() {
  return ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
}

function getLocalQuota() {
  const key = `kuakua_local_quota_${getDateKey()}`;
  const freeLimit = 3;
  const freeUsed = Number(window.localStorage.getItem(key) || 0);
  return normalizeQuota({
    isLoggedIn: false,
    freeLimit,
    freeUsed,
    freeRemaining: Math.max(0, freeLimit - freeUsed),
    canChangePraise: freeUsed < freeLimit
  });
}

function consumeLocalQuota() {
  const key = `kuakua_local_quota_${getDateKey()}`;
  const quota = getLocalQuota();

  if (quota.freeRemaining <= 0) {
    return {
      ok: true,
      allowed: false,
      reason: "guest_quota_exhausted",
      shouldPromptLogin: true,
      ...quota
    };
  }

  window.localStorage.setItem(key, String(quota.freeUsed + 1));
  const nextQuota = getLocalQuota();
  return {
    ok: true,
    allowed: true,
    consumedFrom: "daily_free",
    ...nextQuota
  };
}

function getCloudbaseOptions() {
  const config = getMembershipConfig();
  const options = { env: config.envId };
  const publishableKey = config.publishableKey || config.accessKey;

  if (config.region) {
    options.region = config.region;
  }

  if (publishableKey) {
    options.accessKey = publishableKey;
  }

  return options;
}

function loadCloudbaseSdk() {
  if (window.cloudbase) {
    return Promise.resolve(window.cloudbase);
  }

  const sdkUrl = "https://static.cloudbase.net/cloudbase-js-sdk/2.24.0/cloudbase.full.js";
  const existingScript = document.querySelector(`script[src="${sdkUrl}"]`);

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.cloudbase), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("CloudBase SDK 加载失败")), {
        once: true
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      script.remove();
      reject(new Error("CloudBase SDK 加载超时"));
    }, 8000);

    script.src = sdkUrl;
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timer);
      resolve(window.cloudbase);
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("CloudBase SDK 加载失败"));
    };
    document.head.append(script);
  });
}

async function initMembership() {
  const config = getMembershipConfig();

  if (!config.enabled || !config.envId) {
    membershipState.localFallback = true;
    membershipState.initialized = true;
    membershipState.quota = getLocalQuota();
    updateQuotaUi();
    return;
  }

  try {
    const cloudbaseSdk = await loadCloudbaseSdk();

    if (!cloudbaseSdk) {
      throw new Error("CloudBase SDK 未加载");
    }

    membershipState.app = cloudbaseSdk.init(getCloudbaseOptions());
    membershipState.auth = membershipState.app.auth({ persistence: "local" });
    membershipState.enabled = true;
    membershipState.isLoggedIn = await hasLoginState();
    await refreshQuotaStatus();
  } catch (error) {
    membershipState.lastError = getErrorMessage(error);

    if (isLocalPreview() || !membershipState.isLoggedIn) {
      membershipState.localFallback = true;
      membershipState.lastError = "";
      membershipState.quota = getLocalQuota();
    }

    membershipState.initialized = true;
    updateQuotaUi();
    trackEvent("membership_init_failed", {
      reason: membershipState.lastError || "local_fallback"
    });
  }
}

async function hasLoginState() {
  const auth = membershipState.auth;

  if (!auth) {
    return false;
  }

  if (typeof auth.hasLoginState === "function") {
    return Boolean(await auth.hasLoginState());
  }

  if (typeof auth.getLoginState === "function") {
    return Boolean(await auth.getLoginState());
  }

  return Boolean(auth.currentUser);
}

async function callCloudFunction(name, data = {}) {
  if (!membershipState.app?.callFunction) {
    throw new Error("CloudBase 未初始化");
  }

  try {
    const response = await membershipState.app.callFunction({ name, data, parse: true });

    if (response?.code) {
      const message = response.message || response.code;
      const requestId = response.requestId ? `，请求 ID：${response.requestId}` : "";
      throw new Error(`${message}${requestId}`);
    }

    const result = response?.result ?? response;

    if (typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch (error) {
        return result;
      }
    }

    return result;
  } catch (error) {
    console.error(`[夸夸] 云函数 ${name} 调用失败`, {
      name,
      data,
      error
    });
    throw error;
  }
}

async function refreshQuotaStatus() {
  if (membershipState.localFallback) {
    membershipState.quota = getLocalQuota();
    membershipState.initialized = true;
    updateQuotaUi();
    return membershipState.quota;
  }

  const result = await callCloudFunction("getQuotaStatus", {
    anonymousId: getDistinctId(),
    dateKey: getDateKey()
  });

  membershipState.quota = normalizeQuota(result);
  membershipState.isLoggedIn = membershipState.quota.isLoggedIn;
  membershipState.initialized = true;
  membershipState.lastError = "";
  updateQuotaUi();
  trackEvent("quota_status_loaded", {
    isLoggedIn: membershipState.isLoggedIn,
    freeRemaining: membershipState.quota.freeRemaining,
    bonusCredits: membershipState.quota.bonusCredits,
    paidCredits: membershipState.quota.paidCredits
  });
  return membershipState.quota;
}

async function consumeQuotaBeforeNext() {
  membershipState.lastError = "";

  if (membershipState.localFallback) {
    const result = consumeLocalQuota();
    membershipState.quota = normalizeQuota(result);
    updateQuotaUi();
    return result;
  }

  let result;

  try {
    result = await callCloudFunction("getQuotaStatus", {
      action: "consume",
      anonymousId: getDistinctId(),
      dateKey: getDateKey(),
      currentPraiseId: activeItem?.id || ""
    });
  } catch (error) {
    if (!membershipState.isLoggedIn) {
      membershipState.localFallback = true;
      const fallbackResult = consumeLocalQuota();
      membershipState.quota = normalizeQuota(fallbackResult);
      updateQuotaUi();
      trackEvent("quota_consume_local_fallback", {
        reason: getErrorMessage(error),
        freeRemaining: membershipState.quota.freeRemaining
      });
      return fallbackResult;
    }

    throw error;
  }

  const nextQuota = normalizeQuota(result);
  membershipState.quota = nextQuota;
  updateQuotaUi();
  return { ...result, ...nextQuota };
}

function openLoginModal(reason = "manual") {
  loginModal.style.removeProperty("display");
  loginModal.style.removeProperty("pointer-events");
  loginModal.hidden = false;
  loginModal.classList.add("is-open");
  loginModal.removeAttribute("aria-hidden");
  setAuthMode("login");
  loginMessage.textContent = "";
  loginMessage.classList.remove("is-success");
  setTimeout(() => phoneInput.focus(), 0);
  trackEvent("login_prompt_view", {
    reason,
    freeRemaining: membershipState.quota?.freeRemaining ?? 0
  });
}

function forceHideLoginModal() {
  loginModal.classList.remove("is-open");
  loginModal.hidden = true;
  loginModal.setAttribute("hidden", "");
  loginModal.setAttribute("aria-hidden", "true");
  loginModal.style.setProperty("display", "none", "important");
  loginModal.style.pointerEvents = "none";
}

function closeLoginModal(reason = "manual") {
  forceHideLoginModal();
  window.setTimeout(forceHideLoginModal, 0);
  trackEvent("login_prompt_close", { reason });
}

function showStatusToast(message, type = "info") {
  if (!statusToast) {
    return;
  }

  const safeMessage = getSafeMessage(message);

  window.clearTimeout(statusToastTimer);
  statusToast.textContent = safeMessage;
  statusToast.hidden = false;
  statusToast.classList.toggle("is-success", type === "success");
  statusToast.classList.toggle("is-error", type === "error");
  statusToastTimer = window.setTimeout(() => {
    statusToast.hidden = true;
  }, 3200);
}

function setLoginMessage(message, type = "info") {
  const safeMessage = message ? getSafeMessage(message) : "";
  const isSuccess = type === true || type === "success";
  const isError = type === "error";

  loginMessage.textContent = safeMessage;
  loginMessage.classList.toggle("is-success", isSuccess);
  loginMessage.classList.toggle("is-error", isError);
}

function resetLoginSuccessState() {
  loginForm.hidden = false;
  authModeButton.hidden = false;
  if (loginSuccess) {
    loginSuccess.hidden = true;
  }
  if (loginSuccessTitle) {
    loginSuccessTitle.textContent = "";
  }
  if (loginSuccessText) {
    loginSuccessText.textContent = "";
  }
}

function showLoginSuccessState(authMode, quota, bonusResult) {
  const totalRemaining = getTotalRemaining(quota);
  const hasNewBonus = Boolean(bonusResult?.granted);

  showStatusToast(
    authMode === "register" ? "注册成功，已登录。" : "登录成功，可以继续被夸了。",
    "success"
  );

  if (!loginSuccess || !loginSuccessTitle || !loginSuccessText || !loginContinueButton) {
    closeLoginModal("success_fallback");
    return;
  }

  loginForm.hidden = true;
  authModeButton.hidden = true;
  loginSuccess.hidden = false;
  loginSuccessTitle.textContent = authMode === "register" ? "注册成功" : "登录成功";
  loginSuccessText.textContent = hasNewBonus
    ? `已额外获得 10 次夸夸次数，现在还有 ${totalRemaining} 次可以使用。`
    : `登录状态已确认，现在还有 ${totalRemaining} 次可以使用。`;
  loginContinueButton.focus();
}

function setAuthMode(mode, message = "") {
  const isRegister = mode === "register";

  resetLoginSuccessState();
  membershipState.authMode = isRegister ? "register" : "login";
  membershipState.otpVerifier = null;
  membershipState.otpMode = membershipState.authMode;
  codeInput.value = "";

  loginTitle.textContent = isRegister ? "注册后继续被夸" : "登录后继续被夸";
  loginDescription.textContent = isRegister
    ? "首次使用手机号注册，注册成功后会自动登录，并额外获得 10 次夸夸次数。"
    : "已注册手机号可直接登录。首次使用请先注册，注册后会额外获得 10 次夸夸次数。";
  authModeButton.textContent = isRegister ? "已有账号？切换到登录" : "首次使用？切换到注册";
  sendCodeButton.textContent = isRegister ? "获取注册验证码" : "获取验证码";
  loginSubmitButton.textContent = isRegister ? "注册并登录" : "登录";

  if (message) {
    setLoginMessage(message, "error");
  }

  trackEvent("auth_mode_change", { authMode: membershipState.authMode });
}

function isUserNotFoundError(message) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("user not exist") ||
    normalized.includes("user does not exist") ||
    normalized.includes("not found") ||
    message.includes("用户不存在") ||
    message.includes("用户未注册") ||
    message.includes("还没有注册")
  );
}

function isUserExistsError(message) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("user already exist") ||
    normalized.includes("user exists") ||
    normalized.includes("already registered") ||
    message.includes("用户已存在") ||
    message.includes("已注册") ||
    message.includes("已经注册")
  );
}

function switchToRegisterAfterUserNotFound() {
  setAuthMode("register", "这个手机号还没有注册。请在注册模式下重新获取验证码。");
  trackEvent("phone_login_user_not_found", { loginMethod: "phone" });
}

function switchToLoginAfterUserExists() {
  setAuthMode("login", "这个手机号已经注册过了。请在登录模式下重新获取验证码。");
  trackEvent("phone_register_user_exists", { loginMethod: "phone" });
}


function normalizeMainlandPhone(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function getPhoneForCloudBase() {
  const phone = normalizeMainlandPhone(phoneInput.value);

  if (!/^1\d{10}$/.test(phone)) {
    throw new Error("请输入正确的 11 位手机号");
  }

  return `+86${phone}`;
}

function getCodeValue() {
  const code = codeInput.value.replace(/\D/g, "");

  if (code.length < 4) {
    throw new Error("请输入短信验证码");
  }

  return code;
}

function looksLikeSensitiveToken(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/.test(trimmed);
}

function getSafeMessage(message) {
  const rawMessage = String(message || "");
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("1 text message per minute") ||
    normalized.includes("one text message per minute") ||
    normalized.includes("too many") ||
    normalized.includes("rate limit") ||
    normalized.includes("frequency") ||
    rawMessage.includes("每分钟")
  ) {
    return "验证码发送太频繁了，请 1 分钟后再试。";
  }

  if (isUserNotFoundError(rawMessage)) {
    return "这个手机号还没有注册，请先切换到注册模式。";
  }

  if (isUserExistsError(rawMessage)) {
    return "这个手机号已经注册过了，请切换到登录模式。";
  }

  if (String(message).includes("invalid client id")) {
    return "CloudBase 客户端配置需要更新，请刷新页面后重试。";
  }

  if (looksLikeSensitiveToken(message)) {
    return "登录已经完成，正在同步状态，请稍后刷新页面。";
  }

  return message || "操作失败，请稍后再试";
}

function getErrorMessage(error) {
  if (!error) {
    return "操作失败，请稍后再试";
  }

  if (typeof error === "string") {
    return getSafeMessage(error);
  }

  if (error.error?.message) {
    return getSafeMessage(error.error.message);
  }

  return getSafeMessage(error.message || error.error_description || "操作失败，请稍后再试");
}

function getQuotaBlockMessage(result = {}) {
  const reason = result.reason || "";

  if (reason === "guest_quota_exhausted") {
    return "今天的免费次数已用完，登录后可以继续被夸。";
  }

  if (reason === "quota_exhausted") {
    return "当前次数已用完，后续可以通过会员充值继续使用。";
  }

  if (reason === "missing_anonymous_id") {
    return "暂时无法识别当前设备，请刷新页面后重试。";
  }

  if (reason === "login_required") {
    return "登录状态已失效，请重新登录。";
  }

  if (reason.includes("document with the same _id") || reason.includes("already exists")) {
    return "次数记录正在修复中，请刷新页面后再试。";
  }

  if (reason && reason !== "quota_exhausted") {
    return `次数同步失败：${reason}`;
  }

  return "暂时无法换一句，请稍后重试。";
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function withTimeout(promise, ms, timeoutMessage) {
  let timer = 0;
  const timeout = new Promise((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    window.clearTimeout(timer);
  });
}

async function requestSmsCode() {
  if (!membershipState.auth?.signInWithOtp && !membershipState.auth?.signUp) {
    throw new Error("当前页面暂时无法发送验证码，请确认 CloudBase SDK 已加载");
  }

  const phone = getPhoneForCloudBase();
  trackEvent("sms_code_request", { loginMethod: "phone", authMode: membershipState.authMode });

  const result =
    membershipState.authMode === "register" && typeof membershipState.auth.signUp === "function"
      ? await membershipState.auth.signUp({ phone })
      : await membershipState.auth.signInWithOtp({
          phone,
          shouldCreateUser: membershipState.authMode === "register"
        });

  if (result?.error) {
    throw result.error;
  }

  membershipState.otpVerifier = result?.data?.verifyOtp;
  membershipState.otpMode = membershipState.authMode;

  if (typeof membershipState.otpVerifier !== "function") {
    throw new Error("验证码发送成功，但校验器未返回");
  }

  trackEvent("sms_code_request_success", { loginMethod: "phone", authMode: membershipState.authMode });
}

async function completePhoneLogin() {
  const code = getCodeValue();

  if (typeof membershipState.otpVerifier !== "function") {
    throw new Error("请先获取验证码");
  }

  const authMode = membershipState.otpMode || membershipState.authMode;

  trackEvent(authMode === "register" ? "phone_register_start" : "phone_login_start", {
    loginMethod: "phone",
    authMode
  });
  const result = await membershipState.otpVerifier({ token: code });

  if (result?.error) {
    throw result.error;
  }

  membershipState.isLoggedIn = true;
  membershipState.localFallback = false;
  updateQuotaUi();
  closeLoginModal(authMode === "register" ? "register_auth_success" : "login_auth_success");
  showStatusToast(authMode === "register" ? "注册成功，已登录。" : "登录成功，可以继续被夸了。", "success");
  trackEvent(authMode === "register" ? "phone_register_success" : "phone_login_success", {
    loginMethod: "phone",
    authMode
  });

  try {
    const bonusResult = await withTimeout(
      callCloudFunction("grantLoginBonus", {}),
      8000,
      "登录成功，但领取次数同步较慢"
    );

    if (bonusResult?.ok === false) {
      throw new Error(bonusResult.reason || "登录成功，但领取次数同步较慢");
    }

    trackEvent("login_bonus_granted", {
      granted: bonusResult?.granted,
      bonusCredits: bonusResult?.bonusCredits
    });

    const quota = await withTimeout(
      refreshQuotaStatus(),
      8000,
      "登录成功，但次数同步较慢"
    );

    if (quota.isLoggedIn) {
      showStatusToast(`登录成功，现在还有 ${getTotalRemaining(quota)} 次可以使用。`, "success");
    }
  } catch (error) {
    const message = getErrorMessage(error);
    showStatusToast("登录成功，次数同步可能稍有延迟，请刷新页面查看。", "success");
    trackEvent("auth_post_login_sync_failed", {
      reason: message,
      authMode
    });
  }
}

async function handleNextPraise() {
  if (isNextLoading) {
    return;
  }

  const previousItem = activeItem;
  const nextItem = getNextItem();
  setNextLoading(true);

  try {
    const quotaResult = await consumeQuotaBeforeNext();

    if (!quotaResult.allowed) {
      const blockMessage = getQuotaBlockMessage(quotaResult);

      trackEvent("quota_exhausted", {
        reason: quotaResult.reason,
        isLoggedIn: membershipState.isLoggedIn,
        freeRemaining: quotaResult.freeRemaining,
        bonusCredits: quotaResult.bonusCredits,
        paidCredits: quotaResult.paidCredits
      });

      if (quotaResult.shouldPromptLogin || !membershipState.isLoggedIn) {
        openLoginModal("quota_exhausted");
      }

      showStatusToast(blockMessage, "error");
      return;
    }

    trackEvent(nextButton.dataset.analyticsEvent, {
      style: activeStyle,
      previousPraiseId: previousItem?.id,
      previousPraiseText: previousItem?.praise,
      previousMusicTitle: previousItem?.musicTitle,
      nextStyleIndex: nextItem.styleIndex,
      consumedFrom: quotaResult.consumedFrom,
      freeRemaining: quotaResult.freeRemaining,
      bonusCredits: quotaResult.bonusCredits,
      paidCredits: quotaResult.paidCredits
    });

    trackEvent(quotaResult.consumedFrom === "daily_free" ? "free_quota_used" : "bonus_credit_used", {
      consumedFrom: quotaResult.consumedFrom,
      freeRemaining: quotaResult.freeRemaining,
      bonusCredits: quotaResult.bonusCredits,
      paidCredits: quotaResult.paidCredits
    });

    renderPraise(nextItem, "next_click");
  } catch (error) {
    membershipState.lastError = getErrorMessage(error);
    updateQuotaUi();
    const failMessage = membershipState.isLoggedIn
      ? getQuotaBlockMessage({ reason: membershipState.lastError })
      : "暂时无法同步次数，已切换为本地免费次数。";
    showStatusToast(failMessage, "error");
    trackEvent("quota_consume_failed", {
      reason: membershipState.lastError,
      isLoggedIn: membershipState.isLoggedIn
    });
  } finally {
    setNextLoading(false);
    updateQuotaUi();
  }
}

async function handleLogout() {
  loginButton.disabled = true;
  showStatusToast("正在退出登录...");

  try {
    if (typeof membershipState.auth?.signOut === "function") {
      await membershipState.auth.signOut();
    } else if (typeof membershipState.auth?.logout === "function") {
      await membershipState.auth.logout();
    }
  } catch (error) {
    trackEvent("logout_failed", {
      reason: getErrorMessage(error)
    });
  }

  membershipState.isLoggedIn = false;
  membershipState.otpVerifier = null;
  membershipState.authMode = "login";
  membershipState.otpMode = "login";
  membershipState.lastError = "";

  try {
    await refreshQuotaStatus();
  } catch (error) {
    membershipState.quota = getLocalQuota();
    membershipState.initialized = true;
  }

  updateQuotaUi();
  showStatusToast("已退出登录。", "success");
  trackEvent("logout_success");
}

nextButton.addEventListener("click", handleNextPraise);

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

loginButton.addEventListener("click", async () => {
  if (membershipState.isLoggedIn) {
    await handleLogout();
    return;
  }

  trackEvent(loginButton.dataset.analyticsEvent, {
    freeRemaining: membershipState.quota?.freeRemaining ?? 0
  });
  openLoginModal("login_button");
});

loginModal.addEventListener("click", (event) => {
  if (membershipState.isAuthSubmitting) {
    return;
  }

  if (event.target.closest("[data-close-login]")) {
    closeLoginModal("close_button");
  }
});

if (loginContinueButton) {
  loginContinueButton.addEventListener("click", () => {
    closeLoginModal("success_continue");
  });
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = normalizeMainlandPhone(phoneInput.value);
});

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 8);
});

sendCodeButton.addEventListener("click", async () => {
  sendCodeButton.disabled = true;
  setLoginMessage(membershipState.authMode === "register" ? "正在发送注册验证码..." : "正在发送验证码...");

  try {
    await requestSmsCode();
    setLoginMessage("验证码已发送，请查看手机短信。", "success");
  } catch (error) {
    const message = getErrorMessage(error);
    const failedMode = membershipState.authMode;

    if (membershipState.authMode === "login" && isUserNotFoundError(message)) {
      switchToRegisterAfterUserNotFound();
    } else if (membershipState.authMode === "register" && isUserExistsError(message)) {
      switchToLoginAfterUserExists();
    } else {
      setLoginMessage(message, "error");
      showStatusToast(message, "error");
    }

    trackEvent("sms_code_request_failed", {
      reason: message,
      authMode: failedMode
    });
  } finally {
    sendCodeButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginSubmitButton.disabled = true;
  membershipState.isAuthSubmitting = true;
  setLoginMessage(membershipState.otpMode === "register" ? "正在注册并登录..." : "正在登录...");

  try {
    await completePhoneLogin();
  } catch (error) {
    const message = getErrorMessage(error);
    const failedMode = membershipState.otpMode;

    if (failedMode === "login" && isUserNotFoundError(message)) {
      switchToRegisterAfterUserNotFound();
    } else if (failedMode === "register" && isUserNotFoundError(message)) {
      setLoginMessage("注册验证码已失效，请重新获取注册验证码。", "error");
      showStatusToast("注册验证码已失效，请重新获取注册验证码。", "error");
    } else if (failedMode === "register" && isUserExistsError(message)) {
      switchToLoginAfterUserExists();
    } else {
      setLoginMessage(message, "error");
      showStatusToast(message, "error");
    }

    trackEvent(failedMode === "register" ? "phone_register_failed" : "phone_login_failed", {
      reason: message,
      loginMethod: "phone",
      authMode: failedMode
    });
  } finally {
    membershipState.isAuthSubmitting = false;
    loginSubmitButton.disabled = false;
  }
});

authModeButton.addEventListener("click", () => {
  const nextMode = membershipState.authMode === "register" ? "login" : "register";
  setAuthMode(nextMode);
  setLoginMessage("");
});

async function initApp() {
  setTodayLabel();
  trackEvent("page_view", {
    dateKey: getDateKey()
  });
  renderPraise(getDailyItem(), "daily_default");
  updateMusicButton();
  updateQuotaUi();
  await initMembership();
}

initApp();
