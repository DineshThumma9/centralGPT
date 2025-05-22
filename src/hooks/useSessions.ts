import {
    deleteSession,
    getAllSessions,
    getChatHistory,
    newSession,
    sendMessage,
    updateSessionTitle
} from "../api/session-api.ts";
import type Message from "../entities/Message.ts";
import type Session from "../entities/Session.ts"

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
    setMessages
  } = sessionStore.getState();

  const createNewSession = async () => {
    const { session_id } = await newSession();
    addSession(session_id);
    setCurrentSessionId(session_id);
    clear();
  };

  const changeTitle = async (title: string) => {
    if (!current_session) throw new Error("No active session.");
    const { title: newTitle } = await updateSessionTitle(current_session, title);
    setTitle(newTitle);
  };

  const getHistory = async (session_id: string) => {
    const chat_history: Message[] = await getChatHistory(session_id);
    setCurrentSessionId(session_id);
    setMessages(chat_history);
  };

  const deleteSessionById = async (session_id: string) => {
    await deleteSession(session_id);
    removeSession(session_id);
    clear(); // Optional: only clear if current session is being deleted
  };

  const getSessions = async () => {
    const allSessions: Session[] = await getAllSessions();
    setSessions(allSessions);

  };

  const sendRequest = async (msg: string) => {
    if (!current_session) throw new Error("No active session.");
    addMessage({ sender: "user", content: msg }); // Assuming addMessage expects a Message object
    await sendMessage({ message: msg, session_id: current_session });
  };

  return {
    createNewSession,
    changeTitle,
    getHistory,
    deleteSession: deleteSessionById,
    getSessions,
    sendRequest
  };
};


export default useSessions;