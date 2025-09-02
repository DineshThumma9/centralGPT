// src/api/rag-api.ts (Future RAG endpoints)
import {ragAPI} from "./apiInstance.ts";
import useSessionStore from "../store/sessionStore.ts";
import type {GitRequestSchema} from "../components/GitDialog.tsx";



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
        "Content-Type": "multipart/form-data",
      },
    });

    if(response.status  === 200){
        useSessionStore.getState().setContext("notes")
    }


    return response;
  }

  catch (error) {
      console.log(`error has occured : ${error}`)
  }
};




export const gitFilesUpload = async (body: GitRequestSchema,session_id:string|null,context_id:string|null)=>{



const res = await ragAPI.post(`/git?session_id=${session_id}&context_id=${context_id}`, body, {
    headers: { "Content-Type": "application/json" }
});



    if(res.status  === 200){
        useSessionStore.getState().setContext("code")
    }


    return res.data;

}
