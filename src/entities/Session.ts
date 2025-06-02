import {z} from "zod/v4";




const Session = z.object({

    session_id:z.string(),
    title:z.string().default("New Chat"),
    created_at:z.string().default(new Date().toISOString()),
    updated_at:z.string().optional(),


}
)


export type Session = z.infer<typeof Session>;
export default Session