import { ChakraProvider, Box, Input, IconButton, VStack, HStack, Text, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import ChatPage from "./pages/ChatPage.tsx";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }
//
// function ChatLayout() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//
//   const handleSend = () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { role: "user", content: input }]);
//     setInput("");
//     // Simulate assistant response
//     setTimeout(() => {
//       setMessages(prev => [...prev, { role: "assistant", content: "This is a mock response." }]);
//     }, 500);
//   };
//
//   return (
//     <VStack h="100vh" spacing={0}>
//       {/* Chat history */}
//       <Box flex="1" w="full" p={4} overflowY="auto">
//         <VStack spacing={4} align="stretch">
//           {messages.map((msg, i) => (
//             <Box
//               key={i}
//               alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
//               bg={msg.role === "user" ? "blue.500" : "gray.200"}
//               color={msg.role === "user" ? "white" : "black"}
//               px={4}
//               py={2}
//               borderRadius="md"
//               maxW="80%"
//             >
//               <Text>{msg.content}</Text>
//             </Box>
//           ))}
//         </VStack>
//       </Box>
//
//       {/* Input area */}
//       <Box w="full" p={4} borderTop="1px solid #eee" bg="white">
//         <HStack>
//           <Input
//             placeholder="Type your message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <IconButton
//             aria-label="Send"
//             icon={<FaPaperPlane />}
//             colorScheme="blue"
//             onClick={handleSend}
//           />
//         </HStack>
//       </Box>
//     </VStack>
//   );
// }

export default function App() {
  return (
      <>
        <ChatPage/>
      </>
  );
}
