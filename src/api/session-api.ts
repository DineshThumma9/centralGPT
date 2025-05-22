import axios from "axios";

interface SessionResponse {
    session_id: string;
    message: string;
}

const API = axios.create({
    baseURL: "http://localhost:8001/session",
    withCredentials: true
});

const newSession = async () => {
    console.log("In newSession");

    const res = await API.post("/new", {}, {
        headers: { "Content-Type": "application/json" }
    });

    console.log("Sent request and got response");
    if(!res || !res.data) {
        console.log(res);
        throw new Error("Res is empty");
    } else {
        localStorage.setItem("current Session Id", res.data.session_id);
        console.log("Session Id Stored: " + res.data.session_id);
    }
};

const sendMessage = async (data: { message?: string, session_id: string }) => {
    console.log("In Send Message");

    const res = await API.post("/message", data, {
        headers: { "Content-Type": "text/event-stream" }
    });

    console.log("Sent Request");

    if(!res || !res.data) {
        console.log("Res is Empty");
        throw new Error("Response From send Message is Empty");
    }

    return res.data;
};

const getChatHistory = async (data: { session_id: string, limit?: number }) => {
    console.log("Getting Whole conversation of", data.session_id);
    console.log("data object is" + data);

    const res = await API.get("/history/" + data.session_id);

    if(!res || !res.data) {
        console.log(res.data);
        console.log("History is Empty");
        throw new Error("Chat History Empty");
    }

    return res.data;
};

const deleteSession = async (session_id: string) => {
    console.log("In Delete Session");
    console.log("Sending in Request session id" + session_id);

    const res = await API.delete(session_id);

    if(!res || !res.data) {
        console.log("Res is empty", res);
        throw new Error("Delete session failed");
    }

    return res.data;
};

const updateSessionTitle = async (session_id: string, title: string) => {
    console.log("In Updation of title");

    const res = await API.patch(session_id + "/title", { title }, {
        headers: { "Content-Type": "application/json" }
    });

    if(!res || !res.data) {
        console.log("Res is Empty");
    }

    return res.data;
};

const getAllSessions: = async () => {
    console.log("In get ALL Sessions");

    const res = await API.get("/getAll");

    if(!res || !res.data) {
        console.log("Sessions ids" + res.data);
        throw new Error("Res is Empty no Sessions found");
    }

    return res.data;
};

export {
    newSession,
    sendMessage,
    getChatHistory,
    deleteSession,
    updateSessionTitle,
    getAllSessions
};


