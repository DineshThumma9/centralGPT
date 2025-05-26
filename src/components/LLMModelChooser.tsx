import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text, Badge } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";

const LLMModelChooser = () => {
    const [selectedLLM, setSelectedLLM] = useState("");
    const [selectedModel, setSelectedModel] = useState("");

    const groqModels: string[] = [
        "qwen-qwq-32b",
        "compound-beta",
        "gemma2-9b-it",
        "compound-beta-mini",
    ];

    const apiModels: string[] = [
        "openai",
        "claude",
        "gemini",
        "vertex",
        "azure",
        "groq"
    ];

    const ollamaModels: string[] = [
        "qwen3",
        "codegemma:2b",
        "gemma3:4b",
        "llama3.1:latest",
        "deepseek-coder:6.7b",
        "mistral:latest"
    ];

    const llms: string[] = ["groq", "ollama"];

    const handleApiKeySelect = (apiModel: string) => {
        axios
            .post(`http://localhost:8000/api/${apiModel}`)
            .then((res) => console.log(res.data))
            .catch((err) => console.error("Error fetching API key:", err));
    };

    const handleLLMSelect = (llm: string) => {
        axios
            .post(`http://localhost:8000/api/providers/${llm}`)
            .then((res) => console.log(res.data))
            .catch((err) => console.error("Error fetching LLM:", err));
        setSelectedLLM(llm);
    };

    const handleModelSelect = (model: string) => {
        axios
            .post(`http://localhost:8000/api/models/${model}`)
            .then((res) => console.log(res.data))
            .catch((err) => console.error("Error fetching model:", err));
        setSelectedModel(model);
    };

    return (
        <HStack spacing={3} flexWrap="wrap">
            {/* API Key Selector */}
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    borderColor="app.border"
                    color="app.text.primary"
                    _hover={{
                        borderColor: "app.accent",
                        bg: "surface.tertiary"
                    }}
                >
                    API Keys
                </MenuButton>
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                >
                    {apiModels.map((apiModel) => (
                        <MenuItem
                            key={apiModel}
                            onClick={() => handleApiKeySelect(apiModel)}
                            _hover={{ bg: "surface.tertiary" }}
                            color="app.text.primary"
                            textTransform="capitalize"
                        >
                            {apiModel}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            {/* LLM Provider Selector */}
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    borderColor="app.border"
                    color="app.text.primary"
                    _hover={{
                        borderColor: "app.accent",
                        bg: "surface.tertiary"
                    }}
                >
                    {selectedLLM || "Provider"}
                </MenuButton>
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                >
                    {llms.map((llm) => (
                        <MenuItem
                            key={llm}
                            onClick={() => handleLLMSelect(llm)}
                            _hover={{ bg: "surface.tertiary" }}
                            color="app.text.primary"
                            textTransform="capitalize"
                        >
                            {llm}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            {/* Model Selector */}
            <Menu>
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    borderColor="app.border"
                    color="app.text.primary"
                    _hover={{
                        borderColor: "app.accent",
                        bg: "surface.tertiary"
                    }}
                    isDisabled={!selectedLLM}
                >
                    {selectedModel || "Model"}
                </MenuButton>
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                >
                    {(selectedLLM === "groq" ? groqModels :
                      selectedLLM === "ollama" ? ollamaModels :
                      [...groqModels, ...ollamaModels]).map((model) => (
                        <MenuItem
                            key={model}
                            onClick={() => handleModelSelect(model)}
                            _hover={{ bg: "surface.tertiary" }}
                            color="app.text.primary"
                        >
                            {model}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            {/* Status Display */}
            {(selectedLLM || selectedModel) && (
                <HStack spacing={2}>
                    {selectedLLM && (
                        <Badge
                            colorScheme="brand"
                            variant="subtle"
                            textTransform="capitalize"
                        >
                            {selectedLLM}
                        </Badge>
                    )}
                    {selectedModel && (
                        <Badge
                            colorScheme="green"
                            variant="subtle"
                        >
                            {selectedModel}
                        </Badge>
                    )}
                </HStack>
            )}
        </HStack>
    );
};

export default LLMModelChooser;