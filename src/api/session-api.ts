import axios from "axios";

import useAuthStore from "../store/authStore.ts";
import {z} from "zod/v4";
import Session from "../entities/Session.ts";
import useSessionStore from "../store/sessionStore.ts";
import useInitStore from "../store/initStore.ts";
import Message from "../entities/Message.ts";

const API = axios.create({
    baseURL: "http://localhost:8000/sessions",
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 300,
});

const apiSetUp = axios.create({
    baseURL: "http://localhost:8000/setup",
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 300
});

API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response) {
          console.error(`API Response Error : ${error.response.status}`, error.response.data);
      } else if (error.request) {
          // error.response might be undefined here, so don't access it
          console.error(`API Request Error`, error.request, error.message);
      } else {
          console.error(`Some Error has occurred`, error.message);
      }
      return Promise.reject(error);
  }
);

export const apiKeySelection = async (api_provider: string, api_key: string) => {
    const data = {
        "api_prov": api_provider,
        "api_key": api_key
    };

    await apiSetUp.post("/init", data, {
        headers: {"Content-Type": "application/json"}
    });

    useInitStore.getState().setCurrentAPIProvider(api_provider);
};

export const llmSelection = async (llm_class: string) => {
    await apiSetUp.post(`/providers`, {llm_class}, {
        headers: {"Content-Type": "application/json"}
    });
};

export const modelSelection = async (model: string) => {
    await apiSetUp.post(`/models`, {model}, {
        headers: {"Content-Type": "application/json"}
    });
};

export const newSession = async () => {
    const access = useAuthStore.getState().accessToken;
    console.log("access token :", access);

    const res = await API.post("/new", null, {
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
    const res = await API.get(`/history/${data.session_id}`);

    if (!res?.data) throw new Error("Session History Empty");
    return res.data;
};

export const deleteSession = async (session_id: string) => {
    await API.delete(`/${session_id}`);
};

// export type Message = z.infer<typeof Message>;

export const testMsg = async (msg: string)=> {
    const session_id = useSessionStore.getState().current_session;

    if (!session_id) throw new Error("Missing session ID in localStorage");

    const payload = {session_id, msg};
    const res = await API.post("/simple/", payload, {
        headers: {"Content-Type": "application/json"}
    });

    return Message.parse(res.data);
};

export const updateSessionTitle = async (session_id: string, title: string): Promise<string> => {
    const res = await API.patch(`/${session_id}/title`, {title}, {
        headers: {"Content-Type": "application/json"}
    });

    if (!res?.data?.title) throw new Error("Update session title failed");
    return res.data.title;
};

export const getAllSessions = async () => {
    const res = await API.get("/getAll");
    if (!res?.data) throw new Error("No sessions found");
    return res.data;
};

export const processPdf = async (files: File[] | FileList) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("file", file);
    }

    const res = await API.post("/pdf", formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });

    return res.data;
};

// Request interceptor
API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response) {
          console.error(`API Response Error : ${error.response.status}`, error.response.data);
      } else if (error.request) {
          // error.response might be undefined here, so don't access it
          console.error(`API Request Error`, error.request, error.message);
      } else {
          console.error(`Some Error has occurred`, error.message);
      }
      return Promise.reject(error);
  }
);


// Apply same interceptors to setup API
apiSetUp.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


apiSetUp.interceptors.response.use(
    (response) => response,
     (error) => {
      if (error.response) {
          console.error(`API Response Error : ${error.response.status}`, error.response.data);
      } else if (error.request) {
          // error.response might be undefined here, so don't access it
          console.error(`API Request Error`, error.request, error.message);
      } else {
          console.error(`Some Error has occurred`, error.message);
      }
      return Promise.reject(error);
  }
);