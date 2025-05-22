// import {useState} from "react";
// import axios from "axios";
// import type {Message} from "../components/ChatArea.tsx";
//
// const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState("");
//
//
// const sendMessage = () => {
//         if (!input.trim()) return;
//
//         const userMessage: Message = {role: "user", content: input};
//         setMessages((prev) => [...prev, userMessage]);
//         setInput("");
//
//         axios
//             .get(`http://localhost:8001/chat?message=${encodeURIComponent(input)}`)
//             .then((res) => {
//                 const replyText = typeof res.data === "string" ? res.data : res.data.response;
//                 const assistantReply: Message = {role: "assistant", content: replyText};
//                 setMessages((prev) => [...prev, assistantReply]);
//             })
//             .catch((err) => {
//                 console.error("Error fetching assistant reply:", err);
//             });
//     };
//
//     const sendStreamMessage = async () => {
//         if (!input.trim()) return;
//
//         const userMessage: Message = {role: "user", content: input};
//         setMessages((prev) => [...prev, userMessage]);
//         setInput("");
//
//         try {
//             const response = await fetch(`http://localhost:8001/chat?message=${encodeURIComponent(input)}`, {
//                 method: "GET",
//             });
//
//             if (!response.body) throw new Error("No response body");
//
//             const reader = response.body.getReader();
//             const decoder = new TextDecoder("utf-8");
//
//             let assistantContent = "";
//             setMessages((prev) => [...prev, {role: "assistant", content: ""}]);
//
//             const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
//
//             while (true) {
//                 const {value, done} = await reader.read();
//                 if (done) break;
//
//                 const chunk = decoder.decode(value, {stream: true});
//
//                 for (const char of chunk) {
//                     assistantContent += char;
//
//                     setMessages((prev) => {
//                         const updated = [...prev];
//                         const lastIndex = updated.length - 1;
//                         if (updated[lastIndex].role === "assistant") {
//                             updated[lastIndex] = {
//                                 ...updated[lastIndex],
//                                 content: assistantContent,
//                             };
//                         }
//                         return updated;
//                     });
//
//                     await delay(15); // typewriter speed
//                 }
//             }
//
//         } catch (err) {
//             console.error("Streaming error:", err);
//         }
//     };
