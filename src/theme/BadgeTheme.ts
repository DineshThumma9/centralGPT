import {defineRecipe} from "@chakra-ui/react";




export const badgeRecipe = defineRecipe({
  base: {
    bg: "linear-gradient(135deg, purple.500, violet.500)",
    color: "white",
    textTransform: "capitalize",
    px: 3,
    py: 1,
    borderRadius: "full",
    fontSize: "xs",
    fontWeight: "semibold",
    boxShadow: "0 2px 8px rgba(147, 51, 234, 0.3)",
    border: "1px solid",
    borderColor: "purple.400",
    _hover: {
      transform: "scale(1.05)",
      boxShadow: "0 4px 12px rgba(147, 51, 234, 0.4)"
    },
    transition: "all 0.2s ease"
  }
});
