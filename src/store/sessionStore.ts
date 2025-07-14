import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "../entities/Message.ts";
import type { Session } from "../entities/Session.ts";

export type SessionState = {
  current_session: string | null;
  sessions: Session[];
  messages: Message[];
  title: string;
  isLoading: boolean;
  isStreaming: boolean;
  sending: boolean;
  files: File[];
  shouldStream: boolean;
  context: "code" | "notes" | "vanilla";
  context_id: string | null;

  setCurrentSessionId: (session: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTitle: (title: string) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setSessions: (sessions: Session[]) => void;
  addFiles: (file: File) => void;
  removeFile: (index: number) => void;
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;
  setSending: (sending: boolean) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setShouldStream: (streaming: boolean) => void;
  clear: () => void;
  clearFiles: () => void;
  clearFileInput: () => void;
  setContext: (context: "code" | "notes" | "vanilla") => void;
  setContextID: (context_id: string) => void;
  getSessions: () => Session[];
  clearAllSessions(): void;
  setFiles: (files: File[]) => void;
  addUniqueFiles: (newFiles: File[]) => void; // New method for safe file addition
};

// Helper function to check if two files are identical
const areFilesIdentical = (file1: File, file2: File): boolean => {
  return file1.name === file2.name &&
         file1.size === file2.size &&
         file1.lastModified === file2.lastModified &&
         file1.type === file2.type;
};

const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      current_session: null,
      sessions: [],
      title: "",
      messages: [],
      files: [],
      isLoading: false,
      isStreaming: false,
      shouldStream: false,
      sending: false,
      context: "vanilla",
      context_id: null,

      setCurrentSessionId: (session) => set({ current_session: session }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setTitle: (title) => set({ title }),
      setSending: (sending: boolean) => set({ sending: sending }),

      updateMessage: (messageId, updates) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.message_id === messageId
              ? { ...message, ...updates }
              : message
          ),
        })),

      // Enhanced file management methods
      addFiles: (file: File) =>
        set((state) => {
          // Check if file already exists
          const exists = state.files.some(existingFile =>
            areFilesIdentical(existingFile, file)
          );

          if (!exists) {
            return { files: [...state.files, file] };
          }

          return state; // No change if file already exists
        }),

      removeFile: (index: number) =>
        set((state) => ({
          files: state.files.filter((_, i) => i !== index)
        })),

      setFiles: (files: File[]) => {
        // Remove duplicates from the incoming files array
        const uniqueFiles = files.filter((file, index, self) =>
          index === self.findIndex(f => areFilesIdentical(f, file))
        );

        set({ files: uniqueFiles });
      },

      addUniqueFiles: (newFiles: File[]) =>
        set((state) => {
          const uniqueNewFiles = newFiles.filter(newFile =>
            !state.files.some(existingFile =>
              areFilesIdentical(existingFile, newFile)
            )
          );

          if (uniqueNewFiles.length > 0) {
            return { files: [...state.files, ...uniqueNewFiles] };
          }

          return state;
        }),

      setContext: (context: "code" | "notes" | "vanilla") => set({ context: context }),
      setContextID: (context_id: string) => set({ context_id: context_id }),

      setSessions: (sessions) => {
        const sorted = [...sessions].sort((a, b) =>
          a.created_at && b.created_at
            ? new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            : 0
        );
        set({ sessions: sorted });
      },

      clearAllSessions: () => set({
        messages: [],
        sessions: [],
        current_session: null
      }),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
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
            (s) => s.session_id !== sessionId
          ),
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),

      clearFiles: () => {
        set({ files: [] });
        // Also clear the HTML input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },

      clearFileInput: () => {
        // Clear the actual HTML file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },

      setShouldStream: (shouldStream) => set({ shouldStream: shouldStream }),
      clear: () => set({ messages: [] }),
      getSessions: () => get().sessions,
    }),
    {
      name: "session-persist",
      // Don't persist files as they can't be serialized properly
      partialize: (state) => ({
        ...state,
        files: [] // Always start with empty files array
      })
    }
  )
);

export default useSessionStore;