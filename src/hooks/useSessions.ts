import {
    deleteSession,
    getAllSessions,
    getChatHistory,
    newSession,
    sendMessage,
    streamChatResponse,
    updateSessionTitle
} from "../api/session-api.ts";
import type Message from "../entities/Message.ts";
import type Session from "../entities/Session.ts";
import sessionStore from "../store/sessionStore.ts";

const useSessions = () => {
  const {
    addMessage,
    setSessions,
    removeSession,
    addSession,
    clear,
    setCurrentSessionId,
    current_session,
    setTitle,
    setMessages,
      setStreaming,updateMessage
  } = sessionStore.getState();

  const createNewSession = async () => {
    const session_id = await newSession();
    // Create a proper Session object
    const newSessionObj: Session = {
      session_id,
      title: "New Chat",
      created_at: new Date().toISOString()
    };
    addSession(newSessionObj);
    setCurrentSessionId(session_id);
    clear();
  };

  const sendRequest = async (msg: string) => {
    if (!current_session) throw new Error("No active session.");

    const userMessage: Message = {
        session_id: current_session,
        message_id: Date.now().toString(),
        content: msg,
        role: "user",
        created_at: new Date().toISOString()
    };

    addMessage(userMessage);
    setStreaming(true);

    let response = "";
    const assistantMessageId = Date.now().toString();

    addMessage({
        session_id: current_session,
        message_id: assistantMessageId,
        content: "",
        role: "assistant",
        created_at: new Date().toISOString()
    });

    streamChatResponse( msg, (chunk) => {
        response += chunk;
        updateMessage(assistantMessageId, response);
    }, () => {
        setStreaming(false);
    });
};


  const changeTitle = async (title: string) => {
    if (!current_session) throw new Error("No active session.");
    const newTitle = await updateSessionTitle(current_session, title);
    setTitle(newTitle);
  };

  const getHistory = async (session_id: string) => {
    const chat_history: Message[] = await getChatHistory({ session_id });
    setCurrentSessionId(session_id);
    setMessages(chat_history);
  };

  const deleteSessionById = async (session_id: string) => {
    await deleteSession(session_id);
    removeSession(session_id);
    clear();
  };


  const getSessions = async () => {
    const allSessions: Session[] = await getAllSessions();
    setSessions(allSessions);
  };

  // const sendRequest = async (msg: string) => {
  //   if (!current_session) throw new Error("No active session.");
  //
  //   // Create proper Message object matching your entity
  //   const userMessage: Message = {
  //     session_id: current_session,
  //     message_id: Date.now().toString(), // temporary ID
  //     content: msg,
  //     role: "user",
  //     created_at: new Date().toISOString()
  //   };
  //
  //   addMessage(userMessage);
  //   await sendMessage({ message: msg, session_id: current_session });
  // };

  return {
    createNewSession,
    changeTitle,
    getHistory,
    deleteSessionById,
    getSessions,
    sendRequest
  };
};

export default useSessions;