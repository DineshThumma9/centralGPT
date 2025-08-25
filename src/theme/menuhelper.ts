import {defineSlotRecipe} from "@chakra-ui/react";


export const menuSlots = defineSlotRecipe(({

    slots: ["item", "content", "button"],
    base: {
        item: {
            _hover: {
                bg: "rgba(34, 197, 94, 0.2)",
                color: "green.200"
            },
            color: "white",
            textTransform: "capitalize",
            py: 3,
            px: 4,
            transition: "all 0.2s",
        },
        content: {
            bg: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
            borderColor: "green.500",
            border: "1px solid",
            borderRadius: "lg",
            boxShadow: "0 12px 40px rgba(34, 197, 94, 0.3)",
            backdropFilter: "blur(12px)",
        },
        button: {


            color: "white",
            bg: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            border: "1px solid",
            borderColor: "green.400",
            _hover: {
                bg: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
                borderColor: "green.300",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.4)"
            },
            _active: {
                transform: "translateY(0)",
                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)"
            },
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
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