import {defineSlotRecipe} from "@chakra-ui/react";


export const dialogcust = defineSlotRecipe(({
    slots: ["content", "title", "backdrop", "cancel", "confirm","input"],
    base: {
        content: {
            bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(139, 69, 197, 0.2)",
            boxShadow: "0 20px 60px rgba(139, 69, 197, 0.3)",
            backdropFilter: "blur(20px)",
            maxW: "md",
            mx: 4
        },
        title: {
            fontSize: "xl",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            bg: "linear-gradient(135deg, #8b45c5 0%, #06b6d4 100%)",
            bgClip: "text",
            css: {
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
            }
        },
        backdrop: {
            bg: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(20px)"
        },
        cancel: {
            borderRadius: "12px",
            border: "1px solid rgba(139, 69, 197, 0.3)",
            color: "rgba(255, 255, 255, 0.8)",
            bg: "transparent",
            px: 6,
            py: 2,
            _hover: {
                bg: "rgba(139, 69, 197, 0.1)",
                borderColor: "rgba(139, 69, 197, 0.5)",
                color: "white"
            },
            _active: {
                transform: "translateY(1px)"
            },
            transition: "all 0.2s"
        },
        delete: {

            bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
            borderRadius: "12px",
            px: 6,
            py: 2,
            fontWeight: "medium",
            border: "none",
            _hover: {
                bg: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)"
            },
            _active: {
                transform: "translateY(1px)"
            },
            transition: "all 0.2s"


        },
        button: {
            color: "white",
            borderRadius: "12px",
            px: 6,
            py: 2,
            fontWeight: "medium",
            border: "none",
            _active: {
                transform: "translateY(1px)"
            },
            transition: "all 0.2s"
        },

        save: {

            bg: "linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)",
            color: "white",
            borderRadius: "12px",
            px: 6,
            py: 2,
            fontWeight: "medium",
            border: "none",
            _hover: {
                bg: "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 25px rgba(139, 69, 197, 0.4)"
            },
            _active: {
                transform: "translateY(1px)"
            },
            transition: "all 0.2s"

        },
        input: {
            bg: "rgba(26, 10, 46, 0.6)",
            border: "1px solid rgba(139, 69, 197, 0.3)",
            borderRadius: "12px",
            color: "white",
            px: 4,
            py: 3,
            fontSize: "sm",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            _placeholder: {
                color: "rgba(255, 255, 255, 0.5)"
            },
            _focus: {
                borderColor: "#8b45c5",
                boxShadow: "0 0 0 3px rgba(139, 69, 197, 0.2)",
                bg: "rgba(26, 10, 46, 0.8)"
            },
            _hover: {
                borderColor: "rgba(139, 69, 197, 0.5)",
                bg: "rgba(26, 10, 46, 0.7)"
            }
        }
    }
}));