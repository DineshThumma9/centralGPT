import axios from "axios";
import type Message from "../entities/Message.ts";

const API = axios.create({
    baseURL: "http://localhost:8000/sessions",
    withCredentials: true
});

const apiSetUp = axios.create({
    baseURL: "http://localhost:8000/setup",
    withCredentials: true
});



interface SessionResponse {
    session_id: string;
    message: string;
}

    //
    // const handleApiKeySelect = (apiModel: string) => {
    //     axios
    //         .post(`http://localhost:8000/api/${apiModel}`)
    //         .then((res) => console.log(res.data))
    //         .catch((err) => console.error("Error fetching API key:", err));
    // };
    //
    // const handleLLMSelect = (llm: string) => {
    //     axios
    //         .post(`http://localhost:8000/api/providers/${llm}`)
    //         .then((res) => console.log(res.data))
    //         .catch((err) => console.error("Error fetching LLM:", err));
    //     setSelectedLLM(llm);
    // };
    //
    // const handleModelSelect = (model: string) => {
    //     axios
    //         .post(`http://localhost:8000/api/models/${model}`)
    //         .then((res) => console.log(res.data))
    //         .catch((err) => console.error("Error fetching model:", err));
    //     setSelectedModel(model);
    // };
    //

export const llmSelection = async (llm_class:string)=> {
    try{

        const res = await apiSetUp.post(`/providers` , {llm_class} , {
                headers: { "Content-Type": "application/json" }
            })

        console.log("res is empty: ",res)
        console.log("res is empty:res.data" , res.data)


        if(!res?.data){
            throw Error("Error in llm Selection")
        }



    }

    catch (error){
        console.log("Error has occures here IN llm selection")
        throw  error

    }
}


export const modelSelection= async (model:string)=> {

    try{

        const res = await apiSetUp.post(`/models`,{model} ,{
            headers:{"Content-Type":"application/json"}
        })

        if(!res?.data){
            throw Error("Error in model")
        }



    }
    catch (error){

        console.log("Error in Model selection")
          throw error
    }
}



export const newSession = async (): Promise<string> => {
    try {

        const access = localStorage.getItem("refresh")
        console.log("access token :" ,access)
        const res = await API.post("/new", null, {
           headers: { "Authorization": `Bearer ${access}` }

        });

        console.log(res)

        console.log("This is res data :" , res.data)

        if (!res?.data?.session_id) throw new Error("Empty session response");


        const sessionId = res.data.session_id;
        localStorage.setItem("current_session_id", sessionId);
        console.log("Session Id Stored:", sessionId);
        return sessionId;
    } catch (error) {
        console.error("Error occurred in newSession:", error);
        throw error;
    }
};




export const streamChatResponse = (
    sessionId: string, message: string, assistantMsg: (msg: Message) => void, p0: ({message_id, content}: {
      message_id: any;
      content: any;
    }) => void, onComplete: () => void, onError: (error: Error) => void, p1: (error: any) => void): EventSource => {
    const evtSource = new EventSource(
        `http://localhost:8001/session/message/stream?sessionId=${sessionId}&message=${encodeURIComponent(message)}`
    );

    evtSource.onmessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);

            if (data.type === "content") {
                assistantMsg({
                    message_id: data.message_id,
                    content: data.content,
                    role: "assistant",
                    session_id: sessionId,
                    created_at: new Date().toISOString()
                });
            } else if (data.type === "complete") {
                evtSource.close();
                onComplete();
            } else if (data.type === "error") {
                evtSource.close();
                onError(new Error(data.error ?? "Unknown stream error"));
            }
        } catch (parseError) {
            evtSource.close();
            onError(parseError instanceof Error ? parseError : new Error("Unknown parse error"));
        }
    };

    evtSource.onerror = (err: Event) => {
        evtSource.close();
        onError(new Error("EventSource connection error"));
    };

    evtSource.onopen = () => {
        console.log("SSE connection opened");
    };

    return evtSource;
};




export const getChatHistory = async (data: { session_id: string; limit?: number }) => {
    try {
        const res = await API.get(`/history/${data.session_id}`, {
            params: { limit: data.limit || 50 }
        });

        if (!res?.data) throw new Error("SessionComponent History Empty");
        return res.data;
    } catch (error) {
        console.error("Error while fetching chat history:", error);
        throw error;
    }
};






export const deleteSession = async (session_id: string) => {
    try {
        const res = await API.delete(`/${session_id}`);
        if (!res?.data) throw new Error("Delete session failed");
        return res.data;
    } catch (error) {
        console.error("Error while deleting session:", error);
        throw error;
    }
};





export const testMsg= async (msg: string) => {
    try {


        const current_session_id = localStorage.getItem("current_session_id")
        const res = await API.post(`/simple/${msg}`, {current_session_id}, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("In Sessions API ")
        console.log("Res object is {res}")


        if (!res?.data) throw new Error("Res in Test Msg Failed");
        return res.data;
    } catch (error) {
        console.log("Error while getting test message", error);
        throw error;
    }
};




export const updateSessionTitle = async (session_id: string, title: string): Promise<string> => {
    try {
        const res = await API.patch(`/${session_id}/title`, { title }, {
            headers: { "Content-Type": "application/json" }
        });

        if (!res?.data?.title) throw new Error("Update session title failed");
        return res.data.title;
    } catch (error) {
        console.error("Error while updating session title:", error);
        throw error;
    }
};




export const getAllSessions = async () => {
    try {
        const res = await API.get("/getAll");
        if (!res?.data) throw new Error("No sessions found");
        return res.data;
    } catch (error) {
        console.error("Error getting all sessions:", error);
        throw error;
    }
};
