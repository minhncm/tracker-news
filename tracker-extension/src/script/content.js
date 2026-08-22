const eventTypes = {
  PAGE_ENTER: "PAGE_ENTER",
  PAGE_ACTIVE: "PAGE_ACTIVE",
  PAGE_INACTIVE: "PAGE_INACTIVE",
  PAGE_LEAVE: "PAGE_LEAVE",
};

let sessionId = null;
let activeStartTimePage = null;
let isPageActive = !document.hidden && document.hasFocus();
let totalReadingTime = 0;
let isUserActive = false;
let inactiveTimer = null;
let INACTIVE_TIME = 60 * 1000;

function sendSession() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  const session = {
    sessionId,
    url: window.location.href,
    domain: window.location.hostname,
    title: article.title,
    content: article.textContent.trim(),
  };

  chrome.runtime.sendMessage({
    type: "send_session",
    data: session,
  });
}

function isArticlePage() {
  const JsonLdScripts = document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  for (const script of JsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent);
      const type = data["@type"];
      if (type === "NewsArticle") return true;
    } catch (e) {}
  }
  return false;
}

function calculateReadingTime() {
  if (activeStartTimePage === null) return;

  const now = Date.now();
  totalReadingTime += now - activeStartTimePage;
  activeStartTimePage = null;
}

function sendEvent(eventType) {
  const event = {
    eventType,
    sessionId,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    totalReadingTime,
  };

  chrome.runtime.sendMessage({
    type: "TRACK_EVENT",
    data: event,
  });
}

function setUserInactive() {
  if (!isUserActive) return;

  isUserActive = false;
  calculateReadingTime();
  sendEvent(eventTypes.PAGE_INACTIVE);
}

function setUserActive() {
  if (!isUserActive) {
    isUserActive = true;
    activeStartTimePage = Date.now();
    sendEvent(eventTypes.PAGE_ACTIVE);
  }

  clearTimeout(inactiveTimer);
  inactiveTimer = setTimeout(setUserInactive, INACTIVE_TIME);
}

function checkActivePage() {
  const newState = !document.hidden && document.hasFocus();

  if (newState === isPageActive) return;

  isPageActive = newState;

  if (isPageActive) {
    setUserActive();
  } else {
    setUserInactive();
  }
}

if (isArticlePage()) {
  sessionId = crypto.randomUUID();

  sendSession();
  sendEvent(eventTypes.PAGE_ENTER);

  if (isPageActive) {
    setUserActive();
  }

  ["scroll", "mousemove", "touchstart", "click"].forEach((event) => {
    document.addEventListener(event, setUserActive);
  });

  document.addEventListener("visibilitychange", () => checkActivePage());

  window.addEventListener("blur", () => checkActivePage());

  window.addEventListener("focus", () => checkActivePage());

  window.addEventListener("pagehide", () => {
    setUserInactive();
    sendEvent(eventTypes.PAGE_LEAVE);
  });
}
