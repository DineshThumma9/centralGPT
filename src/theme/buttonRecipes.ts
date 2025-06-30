

// theme/recipes/buttonRecipes.ts
import { defineSlotRecipe } from "@chakra-ui/react";

export const buttonRecipes = defineSlotRecipe({
  slots: ["base", "icon", "avatar", "action"],
  base: {
    base: {
      borderRadius: "md",
      fontWeight: "bold",
      transition: "all 0.2s ease",
      _active: {
        transform: "scale(0.95)",
      },
    },
    icon: {
      borderRadius: "full",
      _active: {
        transform: "scale(0.95)",
      },
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    avatar: {
      padding: 0,
      border: "0px",
      background: "transparent",
      borderRadius: "full",
      transition: "all 0.2s ease",
      zIndex: 2,
    },
    action: {
      size: "sm",
      variant: "ghost",
      transition: "all 0.2s ease",
    },
  },
  variants: {
    visual: {
      primary: {
        base: {
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          color: "white",
          border: "1px solid",
          borderColor: "purple.400",
          boxShadow: "0 2px 12px rgba(147, 51, 234, 0.3)",
          _hover: {
            background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
            transform: "scale(1.05)",
            boxShadow: "0 4px 16px rgba(147, 51, 234, 0.4)",
          },
        },
        icon: {
          background: "linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)",
          color: "white",
          _hover: {
            background: "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)",
            transform: "scale(1.05)",
            boxShadow: "0 6px 20px rgba(139, 69, 197, 0.3)",
          },
        },
      },
      secondary: {
        avatar: {
          _hover: {
            background: "purple.50",
            transform: "scale(1.05)",
          },
          _focus: {
            boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.3)",
            outline: "none",
          },
        },
        action: {
          color: "purple.200",
          _hover: {
            background: "rgba(139, 92, 246, 0.2)",
            color: "purple.100",
          },
        },
      },
      danger: {
        icon: {
          color: "#DC2626",
          marginRight: 2,
        },
        action: {
          color: "#DC2626",
          _hover: {
            background: "rgba(220, 38, 38, 0.1)",
          },
        },
      },
      ghost: {
        action: {
          color: "rgba(255, 255, 255, 0.6)",
          _hover: {
            color: "#8b45c5",
            background: "rgba(139, 69, 197, 0.15)",
            transform: "scale(1.1)",
          },
          borderRadius: "10px",
        },
      },
    },
  },
});