import {defineRecipe} from "@chakra-ui/react";




export const badgeRecipe = defineRecipe({
  base: {
    bg: "linear-gradient(135deg, #16a34a, #15803d)", // Better contrast gradient
    color: "white",
    textTransform: "capitalize",
    px: 3,
    py: 1,
    borderRadius: "full",
    fontSize: "xs",
    fontWeight: "semibold",
    boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)", // Updated shadow color
    border: "1px solid",
    borderColor: "green.400",
    _hover: {
      transform: "scale(1.05)",
      boxShadow: "0 4px 12px rgba(22, 163, 74, 0.4)" // Updated hover shadow
    },
    transition: "all 0.2s ease"
  }
});
