import type Session from "../entities/Session.ts";
import sessionStore from "../store/sessionStore.ts";
import { useEffect, useRef } from "react";
import { newSession, getChatHistory, deleteSession, updateSessionTitle, getAllSessions, streamChatResponse } from "../api/session-api.ts";
import type Message from "../entities/Message.ts";

const useSessions = () => {
  const {
    addMessage, setSessions, removeSession, addSession, clear,
    setCurrentSessionId, current_session, setTitle,
    setMessages, setStreaming, updateMessage, isStreaming, setLoading
  } = sessionStore.getState();

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("EventSource closed on unmount.");
      }
    };
  }, []);

  const createNewSession = async () => {
    try {
      const session_id = await newSession();
      const newSessionObj: Session = {
        session_id,
        title: "New Chat",
        created_at: new Date().toISOString()
      };
      addSession(newSessionObj);
      setCurrentSessionId(session_id);
      clear();
    } catch (e) {
      console.log("Error in createNewSession:", e);
    }
  };

  const sendRequest = async (msg: string) => {
    if (!current_session) throw new Error("No active session.");
    if (isStreaming) return console.warn("Message is already streaming");

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      session_id: current_session,
      message_id: userMsgId,
      content: msg,
      role: "user",
      created_at: new Date().toISOString()
    };

    addMessage(userMessage);
    setStreaming(true);

    if (eventSourceRef.current) eventSourceRef.current.close();

    let assistantMsgId = Date.now().toString();

    eventSourceRef.current = streamChatResponse(
      current_session,
      msg,
      (persistedUserMsg) => updateMessage(userMsgId, persistedUserMsg),
      ({ message_id, content }) => {
        const messages = sessionStore.getState().messages;
        const exists = messages.some(m => m.message_id === message_id);
        if (exists) {
          updateMessage(message_id, { content });
        } else {
          addMessage({
            session_id: current_session,
            message_id,
            content,
            role: "assistant",
            created_at: new Date().toISOString(),
            isStreaming: true
          });
        }
      },
      () => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        eventSourceRef.current = null;
        setStreaming(false);
      },
      () => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        eventSourceRef.current = null;
        setStreaming(false);
      },
      (error) => {
        console.error("SSE error callback:", error);
        updateMessage(userMsgId, { isError: true, isStreaming: false });
        if (eventSourceRef.current) eventSourceRef.current.close();
        eventSourceRef.current = null;
        setStreaming(false);
      }
    );
  };

  const changeTitle = async (title: string) => {
    try {
      setLoading(true);
      if (!current_session) throw new Error("No active session.");
      const newTitle = await updateSessionTitle(current_session, title);
      setTitle(newTitle);
    } catch (e) {
      console.log("Error updating title", e);
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (session_id: string) => {
    try {
      setLoading(true);
      const history = await getChatHistory({ session_id });
      setCurrentSessionId(session_id);
      setMessages(history);
    } catch (e) {
      console.log("Error fetching history", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteSessionById = async (session_id: string) => {
    try {
      await deleteSession(session_id);
      removeSession(session_id);
      clear();
    } catch (e) {
      console.log("Error deleting session", e);
    }
  };

  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      const all = await getAllSessions();
      setSessions(all);
    } catch (e) {
      console.log("Error fetching all sessions", e);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewSession,
    changeTitle,
    getHistory,
    deleteSessionById,
    fetchAllSessions,
    sendRequest
  };
};

export default useSessions;
