import {
    Avatar,
    Box,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    VStack,
} from "@chakra-ui/react";
import {FaPaperPlane} from "react-icons/fa";
import {useState} from "react";
import LLMModelChooser from "./LLMModelChooser.tsx";
import {Search2Icon} from "@chakra-ui/icons";
import axios from "axios";
import Pc from "../assets/react.svg";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatArea() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");


const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage: Message = {role: "user", content: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        axios
            .get(`http://localhost:8001/chat?message=${encodeURIComponent(input)}`)
            .then((res) => {
                const replyText = typeof res.data === "string" ? res.data : res.data.response;
                const assistantReply: Message = {role: "assistant", content: replyText};
                setMessages((prev) => [...prev, assistantReply]);
            })
            .catch((err) => {
                console.error("Error fetching assistant reply:", err);
            });
    };

    const sendStreamMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {role: "user", content: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const response = await fetch(`http://localhost:8001/chat?message=${encodeURIComponent(input)}`, {
                method: "GET",
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let assistantContent = "";
            setMessages((prev) => [...prev, {role: "assistant", content: ""}]);

            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});

                for (const char of chunk) {
                    assistantContent += char;

                    setMessages((prev) => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        if (updated[lastIndex].role === "assistant") {
                            updated[lastIndex] = {
                                ...updated[lastIndex],
                                content: assistantContent,
                            };
                        }
                        return updated;
                    });

                    await delay(15); // typewriter speed
                }
            }

        } catch (err) {
            console.error("Streaming error:", err);
        }
    };

    return (
        <VStack flex="1" spacing={0} h="100vh" overflow="hidden">

            <HStack w="full" justifyContent="space-between" alignItems="center" px={4} py={2}>
                <LLMModelChooser/>
                <Avatar name="Sasuke Uchiha" src={Pc}/>
            </HStack>


            <Box flex="1" w="full" p={4} overflowY="auto" bg="gray.50">
                <VStack spacing={3} align="stretch">
                    {messages.map((msg, idx) => (
                        <Box
                            key={idx}
                            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                            bg={msg.role === "user" ? "blue.500" : "gray.50"}
                            color={msg.role === "user" ? "white" : "black"}
                            px={4}
                            py={2}
                            borderRadius="md"
                            maxW="75%"
                        >
                            <Text>{msg.content}</Text>
                        </Box>
                    ))}
                </VStack>
            </Box>

            <Box w="full" p={4} bg="white" borderTop="1px solid #eee">
                <HStack alignItems="center">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Search2Icon color="gray.300"/>
                        </InputLeftElement>
                        <Input
                            borderRadius="40px"
                            type="search"
                            placeholder="Type your query"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </InputGroup>
                    <IconButton
                        aria-label="Send"
                        icon={<FaPaperPlane/>}
                        colorScheme="blue"
                        onClick={sendStreamMessage}
                    />
                </HStack>
            </Box>
        </VStack>
    );
}