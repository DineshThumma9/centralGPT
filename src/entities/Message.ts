


export default interface Message {
    session_id:string
    message_id:string
    content:string
    role: "user" | "assistant"
    created_at:string
    updates_at?:string

}