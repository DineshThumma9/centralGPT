


export default interface Message {
    session_id:string
    client_id?:string,
    isStreaming?:boolean,
    isError?:boolean,
    message_id:string
    content:string
    sender: "user" | "assistant"
    timestamp:string
    updates_at?:string


}