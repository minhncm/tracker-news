const queue = [];
let isProcessing = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "CREATE_SESSION") {
    return;
  }

  fetch("http://localhost:8080/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(message.data),
  })
    .then((response) => response.json())
    .then(async (data) => {
      const tabId = sender.tab.id;
      await chrome.storage.session.set({
        [`tab_${tabId}`]: {
          sessionId: data.sessionId,
          url: message.data.article.url,
        },
      });

      sendResponse({
        success: true,
        data,
      });
    })
    .catch((error) => {
      sendResponse({
        success: false,
        error: error.message,
      });
    });

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "TRACK_EVENT") {
    return;
  }

  const event = message.data;
  queue.push(event);
  processQueue();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "GET_SESSION") {
    return;
  }

  const tabId = sender.tab.id;
  chrome.storage.session
    .get(`tab_${tabId}`)
    .then((result) => {
      console.log(result);
      sendResponse({
        success: true,
        data: result[key],
      });
    })
    .catch((error) => {
      sendResponse({
        success: false,
        error: error.message,
      });
    });

  return true;
});

async function processQueue() {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  while (queue.length > 0) {
    const event = queue[0];

    try {
      await sendEvent(event);
      queue.shift();
    } catch (error) {
      console.error(error);
      break;
    }
  }
  isProcessing = false;
}

async function sendEvent(event) {
  const response = await fetch("http://localhost:8080/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}
