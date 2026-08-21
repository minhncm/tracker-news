const eventTypes = {
  PAGE_ENTER: "PAGE_ENTER",
  PAGE_ACTIVE: "PAGE_ACTIVE",
  PAGE_INACTIVE: "PAGE_INACTIVE",
  PAGE_LEAVE: "PAGE_LEAVE",
};

let sessionId = null;
let activeStartTimePage = null;
let isActivePage = !document.hidden && document.hasFocus();
let totalReadingTime = 0;
let idleTimer = null;
let isIdle = true;
let IDLE_TIME = 60 * 1000;

function getArticleData() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  return {
    url: window.location.href,
    domain: window.location.hostname,
    title: article.title,
    content: article.textContent.trim(),
  };
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
    // title: data.title,
    timestamp: new Date().toISOString(),
    totalReadingTime,
  };

  // send message to service_worker
  console.log(event);
}

function setUserIdle() {
  isIdle = true;
  calculateReadingTime();
  sendEvent(eventTypes.PAGE_INACTIVE);
}

function setUserActive() {
  if (isIdle) {
    isIdle = false;
    activeStartTimePage = Date.now();
    sendEvent(eventTypes.PAGE_ACTIVE);
  }

  clearTimeout(idleTimer);
  idleTimer = setTimeout(setUserIdle, IDLE_TIME);
}

function checkActivePage() {
  const newState = !document.hidden && document.hasFocus();

  if (newState === isActivePage) return;

  isActivePage = newState;

  if (isActivePage) {
    setUserActive();
  } else {
    setUserIdle();
  }
}

if (isArticlePage()) {
  sessionId = crypto.randomUUID();

  const data = getArticleData();
  sendEvent(eventTypes.PAGE_ENTER);
  setUserActive();

  ["scroll", "mousemove", "touchstart", "click"].forEach((event) => {
    document.addEventListener(event, setUserActive);
  });

  document.addEventListener("visibilitychange", () => checkActivePage());

  window.addEventListener("blur", () => checkActivePage());

  window.addEventListener("focus", () => checkActivePage());

  window.addEventListener("pagehide", () => {
    setUserIdle();
    sendEvent(eventTypes.PAGE_LEAVE);
  });
}
