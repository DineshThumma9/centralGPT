import axios from "axios";
import type Message from "../entities/Message.ts";

// ✅ FIX: Removed duplicate import and redeclaration of `newSession` and `streamChatResponse`
const API = axios.create({
  baseURL: "http://localhost:8001/session",
  withCredentials: true
});

interface SessionResponse {
  session_id: string;
  message: string;
}

// ✅ FIX: Properly defined and exported newSession
export const newSession = async (): Promise<string> => {
  console.log("In newSession");

  try {
    const res = await API.post("/new", {}, {
      headers: { "Content-Type": "application/json" }
    });

    if (!res?.data) throw new Error("Empty response");

    localStorage.setItem("current Session Id", res.data.session_id);
    console.log("Session Id Stored: " + res.data.session_id);
    return res.data.session_id;
  } catch (error) {
    console.log("Error occurred in newSession:", error);
    throw error;
  }
};

// ✅ FIX: Template literal was incorrect; function signature had no types
export const streamChatResponse = (
  sessionId: string,
  message: string,
  onUserPersistence: (msg: Message) => void,
  assistantMsg: (msg: Message) => void,
  onComplete: () => void,
  onPersist: () => void,
  onError: (error?: any) => void
) => {
  const evtSource = new EventSource(
    `/message/stream?sessionId=${sessionId}&message=${encodeURIComponent(message)}`
  );

  evtSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "content") {
      assistantMsg({ message_id: data.message_id, content: data.content } as Message);
    } else if (data.type === "complete") {
      evtSource.close();
      onComplete();
    }
  };

  evtSource.onerror = (err) => {
    console.error("Streaming error:", err);
    evtSource.close();
    onError(err);
  };

  return evtSource;
};

// ✅ Cleaned up redundant logs and structured error handling
export const getChatHistory = async (data: { session_id: string; limit?: number }) => {
  try {
    const res = await API.get("/history/" + data.session_id);
    if (!res?.data) throw new Error("Chat History Empty");
    return res.data;
  } catch (error) {
    console.log("Error while fetching chat history", error);
    throw error;
  }
};

export const deleteSession = async (session_id: string) => {
  try {
    const res = await API.delete(session_id);
    if (!res?.data) throw new Error("Delete session failed");
    return res.data;
  } catch (e) {
    console.log("Error while deleting session", e);
    throw e;
  }
};

export const updateSessionTitle = async (session_id: string, title: string) => {
  try {
    const res = await API.patch(session_id + "/title", { title }, {
      headers: { "Content-Type": "application/json" }
    });
    return res.data.title;
  } catch (e) {
    console.log("Error while updating session title", e);
    throw e;
  }
};

export const getAllSessions = async () => {
  try {
    const res = await API.get("/getAll");
    if (!res?.data) throw new Error("No sessions found");
    return res.data;
  } catch (e) {
    console.log("Error getting all sessions", e);
    throw e;
  }
};
