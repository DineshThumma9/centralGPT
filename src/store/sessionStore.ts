
import {create} from "zustand";
import type { Message } from "../entities/Message.ts";
import type { Session } from "../entities/Session.ts";

export type SessionState = {
    current_session: string | null;
    sessions: Session[];
    messages: Message[];
    title: string;
    isLoading: boolean;
    isStreaming: boolean;

    setCurrentSessionId: (session: string | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setTitle: (title: string) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;
    setSessions: (sessions: Session[]) => void;
    addSession: (session: Session) => void;
    updateSession: (sessionId: string, updates: Partial<Session>) => void;
    removeSession: (sessionId: string) => void;
    setLoading: (loading: boolean) => void;
    setStreaming: (streaming: boolean) => void;
    clear: () => void;
    getSessions: () => Session[];
};

const sessionStore = create<SessionState>((set, get) => ({
    current_session: null,
    sessions: [],
    title: "",
    messages: [],
    isLoading: false,
    isStreaming: false,

    setCurrentSessionId: (session) => set({current_session: session}),
    setTitle: (title) => set({title: title}),
    setMessages: (messages) => set({messages}),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    updateMessage: (messageId, updates) =>
        set((state) => ({
            messages: state.messages.map((message) =>
                message.message_id === messageId
                    ? {...message, ...updates}
                    : message
            ),
        })),

    setSessions: (sessions) => {
        // Sort sessions by timestamp or creation date if available, newest first
        const sortedSessions = [...sessions].sort((a, b) => {
            // Assuming sessions have a created_at or timestamp field
            // If not available, maintain the order they were passed in
            if (a.created_at && b.created_at) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
        });
        set({sessions: sortedSessions});
    },

    // Add new sessions at the beginning (most recent first)
    addSession: (session) =>
        set((state) => {
            // Ensure the new session is added at the beginning
            const newSessions = [session, ...state.sessions];
            console.log('Adding session:', session.session_id, 'Total sessions:', newSessions.length);
            return {
                sessions: newSessions,
            };
        }),

    updateSession: (sessionId, updates) =>
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.session_id === sessionId
                    ? {...session, ...updates}
                    : session
            ),
        })),

    removeSession: (sessionId) =>
        set((state) => ({
            sessions: state.sessions.filter(
                (session) => session.session_id !== sessionId
            ),
        })),

    setLoading: (loading) => set({isLoading: loading}),
    setStreaming: (streaming) => set({isStreaming: streaming}),
    clear: () => set({messages: []}),
    getSessions: () => get().sessions,
}));

export default sessionStore;