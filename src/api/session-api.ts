import axios, {AxiosError} from "axios";
import Message from "../entities/Message.ts";
import useAuthStore from "../store/authStore.ts";
import {ZodError} from "zod";
import {z} from "zod/v4";
import Session from "../entities/Session.ts";
import useSessionStore from "../store/sessionStore.ts";
import useInitStore from "../store/initStore.ts";


const API = axios.create({
    baseURL: "http://localhost:8000/sessions",
    withCredentials: true
});

const apiSetUp = axios.create({
    baseURL: "http://localhost:8000/setup",
    withCredentials: true
});



export const apiKeySelection =   async (api_provider:string,api_key:string)=> {


    const data = {
        "api_prov": api_provider,
        "api_key": api_key
    }
    try {
        const res = await apiSetUp.post("/init", data, {
            headers: {"Content-Type": "application/json"}
        })

        if (res.status != 200) {
            console.log(res.data)
            throw Error("Some error has occures")
        }

        useInitStore.getState().setCurrentAPIProvider(api_provider)
    }catch(error){
            console.log("Error has occurs here in llm selection")
        throw  error

    }
}



export const llmSelection = async (llm_class:string)=> {



    try{

        const res = await apiSetUp.post(`/providers` , {llm_class} , {
                headers: { "Content-Type": "application/json" }
            })
        console.log("Error has occurred in llmselection\n Here is res object:" , res)
    }
    catch (error){
        console.log("Error has occurs here in llm selection")
        throw  error

    }



}


export const modelSelection= async (model:string)=> {

    try{
          await apiSetUp.post(`/models`,{model} ,{
            headers:{"Content-Type":"application/json"}
        })

    }
    catch (error){

        console.log("Error in Model selection")

    }
}







export const newSession = async ()  => {
    try {

        const access = useAuthStore.getState().accessToken
        console.log("access token :" ,access)
        const res = await API.post("/new", null, {
           headers: { "Authorization": `Bearer ${access}` }

        });



        console.log(res)

        console.log("This is res data :" , res.data)

        if (!res?.data?.session_id) throw new Error("Empty session response");


        const sessionId = res.data.session_id;
        useSessionStore.getState().setCurrentSessionId(sessionId)
        console.log("Session Id Stored:", sessionId);
       return Session.parse({
  session_id: res.data.session_id,
});
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
                    sender: "assistant",
                    session_id: sessionId,
                    timestamp: new Date().toISOString()
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
            // params: { limit: data.limit || 50 }
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

        if(res.status !== 200){
            throw Error("Error has occured while deleting Session" ,res.data?.errors)
        }
    } catch (error) {
        console.error("Error while deleting session:", error);
        throw error;
    }
};



export type Message = z.infer<typeof Message>;

export const testMsg = async (msg: string): Promise<Message> => {
  const session_id = useSessionStore.getState().current_session


  if (!session_id) throw new Error("Missing session ID in localStorage");

  const payload = { session_id, msg };

  try {
    const res = await API.post("/simple/", payload, {
      headers: { "Content-Type": "application/json" }
    });

    return Message.parse(res.data);

  } catch (error) {
    if (error instanceof ZodError) {
      console.error("❌ Zod validation failed:", error.errors);
    } else if (error instanceof AxiosError) {
      console.error("❌ Axios error:", error.response?.data || error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }
    throw error; // ✅ preserve error for caller
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



API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

