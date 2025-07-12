// src/api/rag-api.ts (Future RAG endpoints)
import {ragAPI} from "./apiInstance.ts";
import useSessionStore from "../store/sessionStore.ts";
import type {GitRequestSchema} from "../components/GitDialog.tsx";

export const uploadDocument = async (
  files: File[] | FileList,
  session_id: string,
  context_id: string,
  context_type:string="notes"
) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file); // "files" must match the key in Notes model
  }

  formData.append("session_id", session_id);
  formData.append("context_id", context_id);
  formData.append("context_type", context_type); // assuming "notes" is the type

    console.log(`formData : ${formData}`)


  const res = await ragAPI.post("/upload", formData);

  if (res.status === 200) {
    console.log("Upload successful");
    useSessionStore.getState().setContext("notes");
  }

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

