import {v4, v4 as uuidv4} from 'uuid';
import useAuthStore from "../store/authStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import sessionStore from "../store/sessionStore.ts";
import {z} from "zod/v4";
import {useEffect, useRef} from "react";
import useSessions from "./useSessions.ts";


const docSchema = z.object({
    doc_id: z.string().uuid(),
    metadata: z.object({
        creation_date: z.string().optional(),
        document_title: z.string().optional(),
        file_name: z.string().optional(),
        file_path: z.string().optional(),
        file_size: z.number().optional(),
        file_type: z.string().optional(),
        last_modified_date: z.string().optional(),
        page_label: z.string().optional(),

    }),

    score: z.number(),
    text: z.string()
});


type Doc = z.infer<typeof docSchema>;


const API_BASE_URL = "http://localhost:8000";


const useMessage = () => {

    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                console.log("EventSource closed on unmount.");
            }
        };
    }, []);


    const {changeTitle} = useSessions()

    const store = sessionStore.getState();
    const {
        addMessage,
        current_session, setTitle, messages, setStreaming, updateMessage,
        context,files
    } = store;


    async function streamMessage(userMsg: string): Promise<void> {
        const token = useAuthStore.getState().accessToken;
        const assistantMsgId = uuidv4();
        const session_id = useSessionStore.getState().current_session;

        const isFirst = messages.length == 0
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
        let sources: Doc[] = [];
        let isStreamComplete = false;

        // BEFORE streamin
        const context_id = useSessionStore.getState().context_id

// Log them
        console.log("Starting stream with:", session_id, context_id)
        const displayCurrentFiles = []
        for(const file of files){
            displayCurrentFiles.push(file.name)
        }
        try {
            // Close any existing connection
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            console.log('Starting stream with sessionId:', session_id, 'message:', userMsg);

            const response = await fetch(`${API_BASE_URL}/messages/simple-stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {Authorization: `Bearer ${token}`}),
                },
                body: JSON.stringify({
                    session_id: session_id,
                    msg: userMsg,
                    isFirst: isFirst,
                    context_type: context,
                    context_id: context_id,
                    files:displayCurrentFiles
                }),
            });

            console.log(`key Sending : ${session_id}_${context_id}_${context}`)
            console.log(JSON.stringify({
                session_id: session_id,
                msg: userMsg,
                isFirst: isFirst
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
                    const {done, value} = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value, {stream: true});
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


                                    case 'sources': {
                                        const sourcesData = data.content;
                                        const parsed = sourcesData
                                            .map((source: unknown) => docSchema.safeParse(source))
                                            .filter((res: { success: boolean; }): res is z.ZodSafeParseSuccess<Doc> => res.success)
                                            .map((res: { data: never; }) => res.data);

                                        if (parsed.length > 0) {
                                            // Sort by score (highest first)
                                            sources = parsed.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
                                            console.log('Sources received:', sources);

                                            // Don't update the message content here, just store sources
                                            // The sources will be displayed separately in the UI
                                        } else {
                                            console.warn("No valid source documents found in 'sources' payload.");
                                        }

                                        break;
                                    }


                                    case 'done':
                                        console.log('Stream completed');
                                        isStreamComplete = true;

                                        // Final update with complete content and sources
                                        updateMessage(assistantMsgId, {
                                            content: data.content,
                                            isStreaming: false,
                                            sources: sources.length > 0 ? sources : undefined
                                        });
                                        break;


                                    case 'title': {

                                        console.log(`Session Title has been generated ${data.content}`);
                                        setTitle(data.content);
                                        await changeTitle(current_session || v4(), data.content)
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

    return {
        streamMessage
    };
}

export default useMessage;