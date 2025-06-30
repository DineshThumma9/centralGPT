"use client"

import { Switch, Box, Text } from "@chakra-ui/react"
import useSessionStore from "../store/sessionStore.ts";




const StreamSwitch = () => {
    const {shouldStream, setShouldStream} = useSessionStore();

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={3}
            p={3}
            bg="linear-gradient(135deg, rgba(139, 69, 197, 0.1) 0%, rgba(107, 70, 193, 0.05) 100%)"
            borderRadius="12px"
            border="1px solid rgba(139, 69, 197, 0.2)"
            backdropFilter="blur(10px)"
        >
            <Text
                fontSize="sm"
                color="rgba(255, 255, 255, 0.9)"
                fontWeight="medium"
            >
                Stream responses
            </Text>
            <Switch.Root
                checked={shouldStream}
                onCheckedChange={(e) => {
                    setShouldStream(e.checked);
                }}
                size="sm"
            >
                <Switch.HiddenInput />
                <Switch.Control
                    bg={shouldStream ? "linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)" : "rgba(255, 255, 255, 0.3)"}
                    borderColor={shouldStream ? "transparent" : "rgba(139, 69, 197, 0.3)"}
                    _hover={{
                        bg: shouldStream
                            ? "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)"
                            : "rgba(255, 255, 255, 0.4)"
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    boxShadow={shouldStream ? "0 0 0 2px rgba(139, 69, 197, 0.2)" : "none"}
                >
                    <Switch.Thumb
                        bg="white"
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    />
                </Switch.Control>
            </Switch.Root>
        </Box>
    )
}

export default StreamSwitch