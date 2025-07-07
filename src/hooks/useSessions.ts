import type Session from "../entities/Session.ts";
import sessionStore from "../store/sessionStore.ts";

import {useEffect, useRef} from "react";
import {
    deleteSession,
    getAllSessions,
    getChatHistory,
    newSession,
    updateSessionTitle
} from "../api/session-api.ts";
import {z} from "zod/v4";

import type {Message} from "../entities/Message.ts";
import {v4, v4 as uuidv4} from 'uuid';
import useAuthStore from "../store/authStore.ts";
import useSessionStore from "../store/sessionStore.ts";




const API_BASE_URL = "http://localhost:8000";


const useSessions = () => {
    const eventSourceRef = useRef<EventSource | null>(null);




    const store = sessionStore.getState();
    const {
        addMessage, setSessions, removeSession, addSession, clear,
        setCurrentSessionId, current_session, setTitle,messages,
        setMessages, setStreaming, updateMessage,  setLoading,
        context,context_id
    } = store;

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



async function streamMessage(userMsg: string, sessionId: string): Promise<void> {
    const token = useAuthStore.getState().accessToken;
    const assistantMsgId = uuidv4();
    const session_id = sessionId || useSessionStore.getState().current_session;

    const isFirst  =  messages.length == 0
    if (!session_id) {
        throw new Error('No session ID provided');
    }

    console.log('Using session_id:', session_id);

    // Add empty assistant message to start streaming
    addMessage({
        message_id: assistantMsgId,
        session_id: session_id,
        content: '',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
    });

    setStreaming(true);

    // Keep accumulated content in local variable
    let accumulatedContent = '';
    let isStreamComplete = false;

    // BEFORE streaming

const context_id = useSessionStore.getState().context_id

// Log them
console.log("Starting stream with:", session_id, context_id)




    try {
        // Close any existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        console.log('Starting stream with sessionId:', sessionId, 'message:', userMsg);

        const response = await fetch(`${API_BASE_URL}/messages/simple-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
                session_id: session_id,
                msg: userMsg,
                isFirst:isFirst,
                context_type:context,
                context_id:context_id
            }),
        });

        console.log(`key Sending : ${session_id}_${context_id}_${context}`)
        console.log(JSON.stringify({
                session_id: session_id,
                msg: userMsg,
                isFirst:isFirst,
                context_type:context,
                context_id:context_id
            }))

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        if (!response.body) {
            throw new Error('No response body for streaming');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            switch (data.type) {
                                case 'start':
                                    console.log('Stream started');
                                    break;

                                case 'token':
                                    if (data.content && !isStreamComplete) {
                                        accumulatedContent += data.content;
                                        // Update message with streaming content
                                        updateMessage(assistantMsgId, {
                                            content: accumulatedContent,
                                            isStreaming: true
                                        });
                                    }
                                    break;

                                case 'done':
                                    console.log('Stream completed');
                                    isStreamComplete = true;
                                    // Final update with complete content
                                    updateMessage(assistantMsgId, {
                                        content: data.content,
                                        isStreaming: false
                                    });
                                    break;


                                case 'title':
                                    {

                                        console.log(`Session Title has been generated ${data.content}`);
                                    setTitle(data.content);
                                    await changeTitle(current_session || v4(),data.content)
                                    break;
                                    }

                                case 'error':
                                    console.error('Stream error:', data.content);
                                    updateMessage(assistantMsgId, {
                                        content: `[Error: ${data.content}]`,
                                        isStreaming: false
                                    });
                                    isStreamComplete = true;
                                    break;
                            }
                        } catch (parseError) {
                            console.error('Parse error:', parseError, 'Line:', line);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

    } catch (err) {
        console.error('StreamMessage error:', err);
        updateMessage(assistantMsgId, {
            content: '[Error streaming response]',
            isStreaming: false
        });
    } finally {
        setStreaming(false);
    }
}
    const changeTitle = async (sessionId: string, title: string) => {
        try {
            setLoading(true);
            if (!current_session) throw new Error("No active session.");

            const newTitle = await updateSessionTitle(sessionId, title);
            setTitle(newTitle);

            // Update the session in the sessions list reactively
            const currentState = sessionStore.getState();
            const updatedSessions = currentState.sessions.map(session =>
                (session.session_id || session.session_id) === current_session
                    ? {...session, title: newTitle, updated_at: new Date().toISOString()}
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
            const history = await getChatHistory({session_id});
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
            const allSessions: Session[] = await getAllSessions();
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
        streamMessage,
        selectSession
    };
};

export default useSessions;