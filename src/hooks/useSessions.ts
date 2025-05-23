// --- START OF FILE useSessions.ts ---



import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For temporary client-side IDs
import sessionStore from "../store/sessionStore"; // Your Zustand store
import type Message from "../entities/Message";
import type Session from "../entities/Session";


import {
    newSession as apiNewSession,
    getAllSessions as apiGetAllSessions,
    getChatHistory as apiGetChatHistory,
    updateSessionTitle as apiUpdateSessionTitle,
    deleteSession as apiDeleteSession,
    sendMessageAndStreamResponse as apiSendMessageAndStreamResponse,
} from "../api/session-api";

export default function useSessions() {

    const {
        _addMessage, _updateMessage, _setMessages,
        _addSession, _updateSession, _removeSession, _setSessions,
        _setCurrentSessionId,
        _setLoading, _setSendingMessage
    } = sessionStore.getState();

    const eventSourceRef = useRef<EventSource | null>(null);

    // Cleanup EventSource on hook unmount
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                console.log("HOOK: Closing EventSource on unmount.");
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, []);

    const createNewChat = useCallback(async () => {
        console.log("HOOK: createNewChat called");
        _setLoading(true);
        try {
            const newSessionData = await apiNewSession(); // Expects full Session object
            // If apiNewSession only returns session_id, you'd construct more here:
            // const fullNewSession: Session = {
            //     session_id: newSessionData.session_id,
            //     title: "New Chat", // Default title
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString(),
            //     user_id: "some_user_id", // This needs to come from auth or backend
            //     model: "default_model" // This needs to be set
            // };
            // _addSession(fullNewSession);
            // _setCurrentSessionId(fullNewSession.session_id);
            _addSession(newSessionData); // Assuming newSessionData is a complete Session object
            _setCurrentSessionId(newSessionData.session_id); // This action in store should clear messages and set loading
            _setMessages([]); // Explicitly set messages to empty and stop loading for new chat
        } catch (e) {
            console.error("HOOK: Error in createNewChat", e);
        } finally {
            _setLoading(false);
        }
    }, [_setLoading, _addSession, _setCurrentSessionId, _setMessages]);

    const sendMessage = useCallback(async (messageContent: string) => {
        const currentSessionId = sessionStore.getState().current_session_id; // Get latest from store
        const isCurrentlySending = sessionStore.getState().isSendingMessage;

        if (!currentSessionId) {
            console.warn("HOOK: No active session to send message.");
            // alert("Please select or create a chat session first."); // UI should handle this
            return;
        }
        if (isCurrentlySending) {
            console.warn("HOOK: A message is already being streamed. Please wait.");
            return;
        }

        console.log(`HOOK: sendMessage for session ${currentSessionId}: "${messageContent}"`);
        _setSendingMessage(true);

        const tempUserMessageId = `temp-user-${uuidv4()}`;
        const optimisticUserMessage: Message = {
            message_id: tempUserMessageId, // Use temp_id as primary key until server confirms
            temp_id: tempUserMessageId,
            session_id: currentSessionId,
            role: "user",
            content: messageContent,
            timestamp: new Date().toISOString(), // ensure your Message entity has `timestamp`
        };
        _addMessage(optimisticUserMessage);

        // Close any existing EventSource before starting a new one
        if (eventSourceRef.current) {
            console.log("HOOK: Closing existing EventSource before sending new message.");
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        let assistantMessageIdForCurrentStream: string | null = null;

        eventSourceRef.current = apiSendMessageAndStreamResponse(
            currentSessionId,
            messageContent,
            {
                onUserMessagePersisted: (persistedUserMessage) => {
                    console.log("HOOK: User message persisted", persistedUserMessage);
                    _updateMessage(tempUserMessageId, { ...persistedUserMessage, temp_id: undefined });
                },
                onAssistantChunk: (chunkData) => {
                    // console.log("HOOK: Assistant chunk", chunkData); // Can be verbose
                    if (!assistantMessageIdForCurrentStream) {
                        assistantMessageIdForCurrentStream = chunkData.message_id;
                    }
                    const storeHasThisAssistantMsg = sessionStore.getState().messages.some(m => m.message_id === chunkData.message_id);
                    if (storeHasThisAssistantMsg) {
                        _updateMessage(chunkData.message_id, { appendContent: chunkData.content, isStreaming: true });
                    } else {
                        _addMessage({
                            message_id: chunkData.message_id,
                            session_id: chunkData.session_id || currentSessionId, // Prefer chunk's session_id if available
                            role: 'assistant',
                            content: chunkData.content,
                            timestamp: new Date().toISOString(), // Placeholder, will be updated by persisted message
                            isStreaming: true,
                        });
                    }
                },
                onAssistantMessagePersisted: (finalAssistantMessage) => {
                    console.log("HOOK: Assistant message persisted", finalAssistantMessage);
                    assistantMessageIdForCurrentStream = null; // Reset for next message
                    _updateMessage(finalAssistantMessage.message_id, { ...finalAssistantMessage, isStreaming: false, isError: false });
                    // This is a successful end of one message exchange stream
                    if (eventSourceRef.current) {
                        console.log("HOOK: Closing EventSource after assistant message persisted.");
                        eventSourceRef.current.close(); // Close after successful full response
                        eventSourceRef.current = null;
                    }
                    _setSendingMessage(false);
                },
                onError: (errorData) => {
                    console.error("HOOK: SSE Error received", errorData);
                    const idToFlag = errorData.message_id || assistantMessageIdForCurrentStream || tempUserMessageId;
                    _updateMessage(idToFlag, { isError: true, isStreaming: false });
                    
                    if (eventSourceRef.current) { // Ensure it's closed on error too
                        console.log("HOOK: Closing EventSource due to SSE error event.");
                        eventSourceRef.current.close();
                        eventSourceRef.current = null;
                    }
                    _setSendingMessage(false);
                },
                onStreamEnd: () => { // This is an additional callback for when evtSource is definitively closed
                    console.log("HOOK: SSE Stream has ended (closed).");
                    // This might be redundant if onAssistantMessagePersisted or onError already handled cleanup.
                    if (eventSourceRef.current) { // Should already be null if closed properly
                        eventSourceRef.current.close();
                        eventSourceRef.current = null;
                    }
                    if (sessionStore.getState().isSendingMessage) { // If still marked as sending, means it was an abrupt end.
                        const messages = sessionStore.getState().messages;
                        const lastMsg = messages[messages.length-1];
                        // If the last message was an assistant still streaming, mark it as errored.
                        if(lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming){
                            _updateMessage(lastMsg.message_id, { isStreaming: false, isError: true });
                        } else if (lastMsg && lastMsg.temp_id === tempUserMessageId && lastMsg.role === 'user'){
                             // If the user's optimistic message never got a confirmation
                            _updateMessage(tempUserMessageId, {isError: true});
                        }
                        _setSendingMessage(false);
                    }
                }
            }
        );
    }, [_addMessage, _updateMessage, _setSendingMessage]); // currentSessionId will be read fresh from store

    const renameChatTitle = useCallback(async (sessionId: string, newTitle: string) => {
        console.log(`HOOK: renameChatTitle for session ${sessionId} to "${newTitle}"`);
        // Optimistic update (optional)
        // _updateSession(sessionId, { title: newTitle });
        try {
            const updatedSessionData = await apiUpdateSessionTitle(sessionId, newTitle);
            // If API returns full session: _updateSession(sessionId, updatedSessionData);
            // If API returns just {session_id, title}:
            _updateSession(sessionId, { title: updatedSessionData.title, updated_at: new Date().toISOString() }); // Ensure updated_at for sorting
        } catch (e) {
            console.error("HOOK: Error renaming session title", e);
            // Revert optimistic update if it failed (would require fetching original title or more complex state)
        }
    }, [_updateSession]);

    const loadChatHistory = useCallback(async (sessionId: string) => {
        const currentSessionIdInStore = sessionStore.getState().current_session_id;
        if (currentSessionIdInStore === sessionId && sessionStore.getState().messages.length > 0) {
            console.log("HOOK: Chat history already loaded or session already active with messages.");
            // If you want to force reload, remove the messages.length > 0 check.
            // For now, if messages are present for current session, do nothing.
             if(!sessionStore.getState().isLoading) return; // If not loading, don't re-set
        }

        console.log(`HOOK: loadChatHistory for session ${sessionId}`);
        _setCurrentSessionId(sessionId); // This action in store should set isLoading and clear messages
        try {
            const chat_history = await apiGetChatHistory(sessionId);
            _setMessages(chat_history); // This action in store should set messages and clear isLoading
        } catch (e) {
            console.error("HOOK: Error fetching chat history", e);
            _setMessages([]); // Clear messages on error, store action also clears isLoading
        }
    }, [_setCurrentSessionId, _setMessages]);

    const deleteChat = useCallback(async (sessionId: string) => {
        console.log(`HOOK: deleteChat for session ${sessionId}`);
        try {
            await apiDeleteSession(sessionId);
            _removeSession(sessionId); // This action in store handles removing and potentially clearing current session
        } catch (e) {
            console.error("HOOK: Error deleting session", e);
        }
    }, [_removeSession]);

    const fetchAllUserSessions = useCallback(async () => { // Renamed for clarity
        console.log("HOOK: fetchAllUserSessions called");
        _setLoading(true);
        try {
            const allSessions = await apiGetAllSessions();
            _setSessions(allSessions);
        } catch (e) {
            console.error("HOOK: Error fetching all sessions", e);
            _setSessions([]); // Set to empty on error
        } finally {
            _setLoading(false);
        }
    }, [_setLoading, _setSessions]);

    return {
        createNewChat,
        renameChatTitle,
        loadChatHistory, // Renamed from getHistory for clarity
        deleteChat,      // Renamed from deleteSessionById
        fetchAllUserSessions, // Renamed
        sendMessage,     // Renamed from sendRequest
    };
}
// --- END OF FILE useSessions.ts ---