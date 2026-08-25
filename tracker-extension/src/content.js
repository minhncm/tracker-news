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

async function getSession() {
  const response = await chrome.runtime.sendMessage({ type: "GET_SESSION" });

  if (!response.success) {
    return;
  }
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

  if (response.success) {
    sessionId = response.data.sessionId;
  }
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
    await createSession();
    sendEvent(eventTypes.PAGE_ENTER);

    if (!document.hidden && document.hasFocus()) {
      setUserActive();
    }

    ["scroll", "mousemove", "touchstart", "click"].forEach((event) => {
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

    window.addEventListener("pagehide", () => {
      setUserInactive();
      sendEvent(eventTypes.PAGE_LEAVE);
    });
  }
}

init();
