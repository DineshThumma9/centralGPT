// src/api/session-api.ts
import {sessionAPI, setupAPI} from "./apiInstance.ts";
import useAuthStore from "../store/authStore";
import useSessionStore from "../store/sessionStore";
import Session from "../entities/Session";
import useInitStore from "../store/initStore.ts";

export const apiKeySelection = async (api_prov: string, api_key: string) => {
    const data = {
        "api_prov": api_prov.toUpperCase(),
        "api_key": api_key
    };

    console.log("API Provider:", api_prov);
    console.log("API KEY:", api_key);

    const res = await setupAPI.post("/init/", data, {
        headers: {"Content-Type": "application/json"}
    });

    console.log(res.data);
    useInitStore.getState().setCurrentAPIProvider(api_prov);
};

export const llmSelection = async (llm_class: string) => {
    console.log(`Provider llm_class ${llm_class}`);
    await setupAPI.post(`/providers`, {provider: llm_class}, {
        headers: {"Content-Type": "application/json"}
    });
};

export const modelSelection = async (model: string) => {
    console.log(`Model selection: ${model}`);
    await setupAPI.post(`/models`, {model: model}, {
        headers: {"Content-Type": "application/json"}
    });
};

export const newSession = async () => {
    const access = useAuthStore.getState().accessToken;
    console.log("access token:", access);

    const res = await sessionAPI.post("/new", null, {
        headers: {"Authorization": `Bearer ${access}`}
    });

    if (!res?.data?.session_id) throw new Error("Empty session response");

    const sessionId = res.data.session_id;
    useSessionStore.getState().setCurrentSessionId(sessionId);
    console.log("Session Id Stored:", sessionId);

    return Session.parse({
        session_id: res.data.session_id,
    });
};

export const getChatHistory = async (data: { session_id: string; limit?: number }) => {
    const res = await sessionAPI.get(`/history/${data.session_id}`);
    if (!res?.data) throw new Error("Session History Empty");
    console.log(res.data)

    return res.data;
};

export const deleteSession = async (session_id: string) => {
    await sessionAPI.delete(`/${session_id}`);
};


export const updateSessionTitle = async (session_id: string, title: string): Promise<string> => {
    const res = await sessionAPI.patch(`/${session_id}/title`, {title}, {
        headers: {"Content-Type": "application/json"}
    });

    if (!res?.data?.title) throw new Error("Update session title failed");
    return res.data.title;
};

export const getAllSessions = async () => {
    const res = await sessionAPI.get("/getAll");
    if (!res?.data) throw new Error("No sessions found");
    return res.data;
};

