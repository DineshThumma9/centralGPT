


export default interface Message {
    session_id:string
    client_id?:string,
    isStreaming?:boolean,
    isError?:boolean,
    message_id:string
    content:string
    role: "user" | "assistant"
    created_at:string
    updates_at?:string


}