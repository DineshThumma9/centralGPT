import type Session from "../entities/Session.ts";
import sessionStore from "../store/sessionStore.ts";
import {useEffect, useRef} from "react";
import {
  deleteSession,
  getAllSessions,
  getChatHistory,
  newSession,
  streamChatResponse,
  testMsg,
  updateSessionTitle
} from "../api/session-api.ts";
import type Message from "../entities/Message.ts";
import {z} from "zod/v4";





const useSessions = () => {
  const eventSourceRef = useRef<EventSource | null>(null);

  // Get store functions and state
  const store = sessionStore.getState();
  const {
    addMessage, setSessions, removeSession, addSession, clear,
    setCurrentSessionId, current_session, setTitle,
    setMessages, setStreaming, updateMessage, isStreaming, setLoading,
  } = store;

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("EventSource closed on unmount.");
      }
    };
  }, []);



const tstMsgFunc = async (msg: string) => {
  try {
    addMessage(await testMsg(msg));
  } catch (error) {
    console.error("Error in tstMsgFunc:", error);
  }
};



  const createNewSession = async () => {
    try {
      setLoading(true);
      const session = await newSession();

      addSession(session);
      setCurrentSessionId(session.session_id);
      setTitle("New SessionComponent");
      clear();

      console.log("New session created and set as current:", session.session_id);
      return session.session_id;
    } catch (e) {
      console.error("Error in createNewSession:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (msg: string) => {
    if (!current_session) {
      console.warn("No active session, creating new one...");
      await createNewSession();
      const updatedState = sessionStore.getState();
      if (!updatedState.current_session) {
        throw new Error("Failed to create session");
      }
    }

    const activeSession = sessionStore.getState().current_session;
    if (isStreaming) {
      console.warn("Message is already streaming");
      return;
    }
   type Message = z.infer<typeof Message>;
    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      session_id: activeSession!,
      message_id: userMsgId,
      content: msg,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    addMessage(userMessage);
    setStreaming(true);

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      eventSourceRef.current = streamChatResponse(
        activeSession!,
        msg,
        (persistedUserMsg) => {
          updateMessage(userMsgId, persistedUserMsg);
        },
        ({ message_id, content }) => {
          const messages = sessionStore.getState().messages;
          const exists = messages.some(m => m.message_id === message_id);

          if (exists) {
            updateMessage(message_id, { content });
          } else {
            addMessage({
              session_id: activeSession!,
              message_id,
              content,
              sender: "assistant",
              timestamp: new Date().toISOString(),
              isStreaming: true
            });
          }
        },
        () => {
          console.log("Streaming completed");
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setStreaming(false);


          const currentState = sessionStore.getState();
          const updatedSessions = currentState.sessions.map(session =>
            (session.session_id || session.session_id) === activeSession
              ? { ...session, updated_at: new Date().toISOString() }
              : session
          );
          setSessions(updatedSessions);
        },
        () => {
          console.log("Message persisted");
        },
        (error) => {

          console.error("SSE error:", error);
          updateMessage(userMsgId, { isError: true, isStreaming: false });
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setStreaming(false);
        }
      );
    } catch (error) {
      console.error("Error setting up streaming:", error);
      setStreaming(false);
      throw error;
    }
  };

  const changeTitle = async (title: string) => {
    try {
      setLoading(true);
      if (!current_session) throw new Error("No active session.");

      const newTitle = await updateSessionTitle(current_session, title);
      setTitle(newTitle);

      // Update the session in the sessions list reactively
      const currentState = sessionStore.getState();
      const updatedSessions = currentState.sessions.map(session =>
        (session.session_id || session.session_id) === current_session
          ? { ...session, title: newTitle, updated_at: new Date().toISOString() }
          : session
      );
      setSessions(updatedSessions);

      console.log("Title updated:", newTitle);
    } catch (e) {
      console.error("Error updating title", e);
      throw e;
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

      const currentState = sessionStore.getState();
      const session = currentState.sessions.find(s => (s.session_id || s.session_id) === session_id);
      if (session) {
        setTitle(session.title);
      }

      console.log("History loaded for session:", session_id);
    } catch (e) {
      console.error("Error fetching history", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteSessionById = async (session_id: string) => {
    try {
      setLoading(true);
      await deleteSession(session_id);
      removeSession(session_id);


      if (current_session === session_id) {
        const remainingSessions = sessionStore.getState().sessions;
        if (remainingSessions.length > 0) {
          const latestSession = remainingSessions.sort((a, b) =>

            new Date(a.updated_at || a.created_at).getTime() -
                new Date(b.updated_at || b.created_at).getTime()
          )[0];
          await getHistory(latestSession.session_id || latestSession.session_id!);
        } else {

          setCurrentSessionId(null);
          clear();
          setTitle("");
        }
      }

      console.log("Session deleted:", session_id);
    } catch (e) {
      console.error("Error deleting session", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getSessions = async () => {
    try {
      setLoading(true);
       type Session = z.infer<typeof Session>;
      const allSessions:Session[] = await getAllSessions();
      setSessions(allSessions);

      const currentState = sessionStore.getState();
      if (!currentState.current_session && allSessions.length > 0) {
        const latestSession = allSessions.sort((a, b) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
        )[0];
        await getHistory(latestSession.session_id || latestSession.session_id);
      }

      console.log("Sessions loaded:", allSessions.length);
    } catch (e) {
      console.error("Error fetching all sessions", e);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const selectSession = async (session_id: string) => {
    try {
      if (current_session === session_id) {
        console.log("Session already selected:", session_id);
        return;
      }


      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setStreaming(false);
      }

      await getHistory(session_id);
      console.log("Session selected:", session_id);
    } catch (e) {
      console.error("Error selecting session", e);
      throw e;
    }
  };

  const fetchAllSessions = getSessions;

  return {
    createNewSession,
    changeTitle,
    getHistory,
    deleteSessionById,
    getSessions,
    fetchAllSessions,
    sendRequest,
    tstMsgFunc,
    selectSession
  };
};

export default useSessions;