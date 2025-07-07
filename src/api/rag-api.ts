
// src/api/rag-api.ts (Future RAG endpoints)
import { ragAPI } from "./apiInstance.ts";
import useSessions from "../hooks/useSessions.ts";
import useSessionStore from "../store/sessionStore.ts";

export const uploadDocument = async (files: File[] | FileList) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append("file", file);
    }

    const res = await ragAPI.post("/upload", formData, {
        headers: {"Content-Type": "multipart/form-data"}
    });

    return res.data;
};

export const searchDocuments = async (query: string, limit: number = 10) => {
    const res = await ragAPI.post("/search",
        { query, limit },
        { headers: {"Content-Type": "application/json"} }
    );

    return res.data;
};

export const deleteDocument = async (documentId: string) => {
    await ragAPI.delete(`/document/${documentId}`);
};

// Health check function (can be moved to a separate utility file)
function startHealthCheck() {
    setInterval(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/health`);
            if (!response.ok) {
                handleServerDown();
            }
        } catch (error) {
            handleServerDown();
        }
    }, 30000);
}


import type {GitRequestSchema} from "../components/GitDialog.tsx";

export const gitFilesUpload = async (body: GitRequestSchema,session_id:string|null,context_id:string|null)=>{


    const res_body = {
        "req":body,
        "session_id":session_id,
        "context_id":context_id

    }


    console.log(`res body ${res_body}` )

const res = await ragAPI.post(`/git?session_id=${session_id}&context_id=${context_id}`, body, {
    headers: { "Content-Type": "application/json" }
});



    if(res.status  === 200){
         console.log(`key:${session_id}_${context_id}_code`)
         console.log("Request was succesful")
        useSessionStore.getState().setContext("code")
    }

}

function handleServerDown() {
    // Handle server down logic

}

