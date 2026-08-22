import axios from "axios";

const httpRequest = axios.create({
  baseURL: ApplicationPath.HOME_PATH,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SEND_SESSION") {
    httpRequest.post("/sessions", message.data);
  }

  if (message.type === "TRACK_EVENT") {
    httpRequest.post("/events", message.data);
  }
});
