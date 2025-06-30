import {defineSlotRecipe} from "@chakra-ui/react";


export const menuSlots = defineSlotRecipe(({

    slots: ["item", "content", "button"],
    base: {
        item: {
            _hover: {
                bg: "rgba(147, 51, 234, 0.2)",
                color: "purple.200"
            },
            color: "white",
            textTransform: "capitalize",
            py: 3,
            px: 4,
            transition: "all 0.2s",
        },
        content: {
            bg: "linear-gradient(135deg, #2d1b69 0%, #1a0b2e 100%)",
            borderColor: "purple.500",
            border: "1px solid",
            borderRadius: "lg",
            boxShadow: "0 12px 40px rgba(147, 51, 234, 0.3)",
            backdropFilter: "blur(12px)",
        },
        button: {


            color: "white",
            bg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            border: "1px solid",
            borderColor: "purple.400",
            _hover: {
                bg: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                borderColor: "purple.300",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 16px rgba(147, 51, 234, 0.4)"
            },
            _active: {
                transform: "translateY(0)",
                boxShadow: "0 2px 8px rgba(147, 51, 234, 0.3)"
            },
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(147, 51, 234, 0.2)",
        }
    },
    variants:{
        visual:{
            session:{

                content: {
                    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)",
                    borderColor: "rgba(139, 69, 197, 0.3)",
                    shadow: "0 10px 40px rgba(26, 10, 46, 0.4)",
                    borderRadius: "12px",
                    border: "1px solid rgba(139, 69, 197, 0.2)",
                    backdropFilter: "blur(20px)",
                },

                item : {
                    color: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    mx: 1,
                    my: 1,
                    _hover: {
                        bg: "rgba(139, 69, 197, 0.2)",
                        color: "white"
                    }
                }

            }
        }
    },

}));