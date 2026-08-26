const eventTypes = {
  PAGE_ENTER: "PAGE_ENTER",
  PAGE_ACTIVE: "PAGE_ACTIVE",
  PAGE_INACTIVE: "PAGE_INACTIVE",
  PAGE_LEAVE: "PAGE_LEAVE",
};

let sessionId = null;
let isUserActive = false;
let inactiveTimer = null;
let INACTIVE_TIME = 60 * 1000;
let isPageReloading = false;

async function getSession() {
  const response = await chrome.runtime.sendMessage({ type: "GET_SESSION" });
  const currentUrl = window.location.href;

  if (response.success && response.data && response.data.url === currentUrl) {
    return response.data;
  }
  return null;
}

async function createSession() {
  const documentClone = document.cloneNode(true);
  const parsedArticle = new Readability(documentClone).parse();

  if (!parsedArticle) {
    return {
      success: false,
    };
  }

  const session = {
    article: {
      url: window.location.href,
      domain: window.location.hostname,
      title: parsedArticle.title,
      content: parsedArticle.textContent.trim(),
    },
  };

  const response = await chrome.runtime.sendMessage({
    type: "CREATE_SESSION",
    data: session,
  });

  if (!response.success) {
    return null;
  }

  return response.data.sessionId;
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

function sendEvent(eventType) {
  const event = {
    eventType,
    sessionId,
    timestamp: new Date().toISOString(),
  };

  chrome.runtime.sendMessage({
    type: "TRACK_EVENT",
    data: event,
  });
}

function setUserInactive() {
  if (!isUserActive) return;

  isUserActive = false;
  sendEvent(eventTypes.PAGE_INACTIVE);
}

function setUserActive() {
  if (!isUserActive) {
    isUserActive = true;
    sendEvent(eventTypes.PAGE_ACTIVE);
  }

  clearTimeout(inactiveTimer);
  inactiveTimer = setTimeout(setUserInactive, INACTIVE_TIME);
}

async function init() {
  if (isArticlePage()) {
    const currentUrl = window.location.href;
    const session = await getSession();

    if (session && session.url === currentUrl) {
      sessionId = session.sessionId;
    } else {
      sessionId = await createSession();
      sendEvent(eventTypes.PAGE_ENTER);
    }

    if (!document.hidden && document.hasFocus()) {
      setUserActive();
    }

    ["scroll", "touchstart", "click"].forEach((event) => {
      document.addEventListener(event, () => setUserActive());
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && document.hasFocus()) {
        setUserActive();
      } else {
        setUserInactive();
      }
    });

    window.addEventListener("blur", () => setUserInactive());

    window.addEventListener("focus", () => setUserActive());

    document.addEventListener("keydown", (e) => {
      if (e.key === "F5") {
        isPageReloading = true;
        setUserInactive();
      }
    });

    window.addEventListener("pagehide", () => {
      if (isPageReloading) {
        return;
      }
      setUserInactive();
      sendEvent(eventTypes.PAGE_LEAVE);
    });
  }
}

init();
