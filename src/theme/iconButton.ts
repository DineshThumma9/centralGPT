import {defineRecipe} from "@chakra-ui/react";




export const iconButton = defineRecipe(({

    base: {
        borderRadius: "full",
        _active: {
            transform: "scale(0.95)"
        },
        bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",

        color: "white",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
            bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            transform: "scale(1.05)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)"
        },

    },
    variants: {
        visual: {
            danger: {
                marginRight: 8,
                color: "#DC2626"
            },
            session:{
                variant: "ghost",
                size: "sm",
                color: "rgba(255, 255, 255, 0.6)",
                _hover: {
                    color: "#8b45c5",
                    bg: "rgba(139, 69, 197, 0.15)",
                    transform: "scale(1.1)"
                },
                borderRadius: "10px",
                transition: "all 0.2s"
            }
        }
    }

}));