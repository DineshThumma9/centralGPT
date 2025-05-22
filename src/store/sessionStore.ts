import type { Session } from "react-router-dom";
import type { Message } from "react-hook-form";
import { createStore } from "zustand/vanilla";

export type SessionState = {
    current_session: string | null;
    sessions: Session[];
    messages: Message[];
    isLoading: boolean;
    isStreaming: boolean;

    setCurrentSessionId: (session: string | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (messageId: string, content: string) => void;
    setSessions: (sessions: Session[]) => void;
    addSession: (session: Session) => void;
    updateSession: (sessionId: string, updates: Partial<Session>) => void;
    removeSession: (sessionId: string) => void;
    setLoading: (loading: boolean) => void;
    setStreaming: (streaming: boolean) => void;
    clear: () => void;
};

const sessionStore = createStore<SessionState>((set) => ({
    current_session: null,
    sessions: [],
    messages: [],
    isLoading: false,
    isStreaming: false,

    setCurrentSessionId: (session) => set({ current_session: session }),

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    updateMessage: (messageId, content) =>
        set((state) => ({
            messages: state.messages.map((message) =>
                message.message_id === messageId
                    ? { ...message, content }
                    : message
            ),
        })),

    removeMessage: (messageId) =>
        set((state) => ({
            messages: state.messages.filter(
                (message) => message.message_id !== messageId
            ),
        })),

    setSessions: (sessions) => set({ sessions }),

    addSession: (session) =>
        set((state) => ({
            sessions: [...state.sessions, session],
        })),

    updateSession: (sessionId, updates) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.session_id === sessionId
                    ? { ...session, ...updates }
                    : session
            ),
        })),

    removeSession: (sessionId) =>
        set((state) => ({
            sessions: state.sessions.filter(
                (session) => session.session_id !== sessionId
            ),
        })),

    setLoading: (loading) => set({ isLoading: loading }),
    setStreaming: (streaming) => set({ isStreaming: streaming }),
    clear: () => set({ messages: [] }),
}));

export default sessionStore;