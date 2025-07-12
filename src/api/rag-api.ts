// src/api/rag-api.ts (Future RAG endpoints)
import {ragAPI} from "./apiInstance.ts";
import useSessionStore from "../store/sessionStore.ts";
import type {GitRequestSchema} from "../components/GitDialog.tsx";
import axios, {type AxiosError} from "axios";



export const uploadDocument = async (
  files: File[],
  sessionId: string,
  contextId: string
) => {
  const formData = new FormData();
files.forEach((file, index) => {
  console.log(`File ${index}`, file, typeof file, file instanceof File);
  if (file instanceof File) {
    formData.append("files", file);
  } else {
    console.warn(`Skipping invalid file at index ${index}`, file);
  }
});


  formData.append("session_id", sessionId);
  formData.append("context_id", contextId);
  formData.append("context_type", "notes");

  try {
    const response = await ragAPI.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 🛠️ REQUIRED FOR FASTAPI
      },
    });

    return response.data;
  } catch (error) {
    console.error("RAG API Response Error:", error.response?.data || error);
    throw error;
  }
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


    return res.data;

}

function handleServerDown() {
    // Handle server down logic

}

