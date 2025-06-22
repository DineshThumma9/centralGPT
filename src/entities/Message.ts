import { z } from "zod/v4";

const Message = z.object({
  session_id: z.string(),
  message_id: z.string(),
  content: z.string(),
  sender: z.union([z.literal("user"), z.literal("assistant")]),
  timestamp: z.string(),
  sessionTitle:z.string().optional(),
  client_id: z.string().optional(),
  updated_at: z.string().optional(),
  isStreaming: z.boolean().optional(),
  isError: z.boolean().optional(),
});

export type Message = z.infer<typeof Message>;
export default Message;