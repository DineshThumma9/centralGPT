import { defineSlotRecipe } from "@chakra-ui/react"

export const buttonsReci = defineSlotRecipe({
  className: "buttons",
  slots: ["aiAction", "userAction", "sessionAction"],
  base: {
    aiAction: {


      color: "purple.200",
      _hover: {
        bg: "transparent",
        color: "purple.100"
      },
      transition: "all 0.2s ease"
    },
    userAction: {


      color: "purple.200",
      _hover: {
        bg: "transparent",
        color: "purple.100"
      },
      transition: "all 0.2s ease",
      // Override for copied state
      "&[data-copied='true']": {
        color: "purple.300",
        bg: "rgba(139, 92, 246, 0.15)"
      }
    },
    sessionAction: {

      color: "rgba(255, 255, 255, 0.7)",
      _hover: {
        bg: "purple.50",
        color: "white"
      },
      transition: "all 0.2s ease"
    }
  }
})