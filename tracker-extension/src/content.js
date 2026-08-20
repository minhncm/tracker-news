const siteConfig = {
  "vnexpress.net": {
    selectors: [".fck_detail"],
  },

  "dantri.com.vn": {
    selectors: [".articleContent"],
  },

  "tuoitre.vn": {
    selectors: [".detail-content"],
  },
};

let activeStartTimePage = null;
let isActivePage = !document.hidden && document.hasFocus();
let totalReadingTime = 0;

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
  const config = siteConfig[window.location.hostname];

  if (!config) {
    return false;
  }

  return config.selectors.some((selector) => document.querySelector(selector));
}

function calculateReadingTime() {
  if (activeStartTimePage === null) return;

  const now = Date.now();
  totalReadingTime += now - activeStartTimePage;
  activeStartTimePage = null;
}

function sendEvent(eventType, sessionId) {
  const event = {
    eventType,
    sessionId,
    url: window.location.href,
    // title: data.title,
    timestamp: new Date().toISOString(),
    totalReadingTime,
  };

  // send message to service_worker
}

function checkActivePage(sessionId) {
  const newState = !document.hidden && document.hasFocus();

  if (newState === isActivePage) return;

  isActivePage = newState;

  if (isActivePage) {
    activeStartTimePage = Date.now();
    sendEvent("PAGE_ACTIVE", sessionId);
  } else {
    calculateReadingTime();
    sendEvent("PAGE_INACTIVE", sessionId);
  }
}

if (isArticlePage()) {
  const sessionId = crypto.randomUUID();
  activeStartTimePage = Date.now();

  const data = getArticleData();
  sendEvent("PAGE_ENTER", sessionId);

  document.addEventListener("visibilitychange", () =>
    checkActivePage(sessionId),
  );

  window.addEventListener("blur", () => checkActivePage(sessionId));

  window.addEventListener("focus", () => checkActivePage(sessionId));

  window.addEventListener("pagehide", () => {
    calculateReadingTime();
    sendEvent("PAGE_LEAVE", sessionId);
  });
}
