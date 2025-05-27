import {Badge, Button, HStack, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {ChevronDownIcon} from "lucide-react";
import {useState} from "react";
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


// ...your handler and state code...

    return (
        <HStack gap={3} flexWrap="wrap">
            {/* API Key Selector */}
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        // rightIcon={<ChevronDownIcon/>}
                        variant="outline"
                        size="sm"
                        borderColor="app.border"
                        color="app.text.primary"
                        _hover={{
                            borderColor: "app.accent",
                            bg: "surface.tertiary"
                        }}
                    >
                        <ChevronDownIcon/>
                        API Keys
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <MenuPositioner>
                        <Menu.Content
                            bg="app.card.bg"
                            borderColor="app.border"
                        >
                            {apiModels.map((apiModel) => (
                                <Menu.Item
                                    value={apiModel}
                                    key={apiModel}
                                    onClick={() => handleApiKeySelect(apiModel)}
                                    _hover={{bg: "surface.tertiary"}}
                                    color="app.text.primary"
                                    textTransform="capitalize"
                                >
                                    {apiModel}
                                </Menu.Item>
                            ))}
                        </Menu.Content>
                    </MenuPositioner>
                </Portal>
            </Menu.Root>

            {/* LLM Provider Selector */}
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        borderColor="app.border"
                        color="app.text.primary"
                        _hover={{
                            borderColor: "app.accent",
                            bg: "surface.tertiary"
                        }}
                    >
                        <ChevronDownIcon/>
                        {selectedLLM || "Provider"}
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <MenuPositioner>
                        <Menu.Content
                            bg="app.card.bg"
                            borderColor="app.border"
                        >
                            {llms.map((llm) => (
                                <Menu.Item
                                    value={llm}
                                    key = {llm}
                                    onClick={() => handleLLMSelect(llm)}
                                    _hover={{bg: "surface.tertiary"}}
                                    color="app.text.primary"
                                    textTransform="capitalize"
                                >
                                    {llm}
                                </Menu.Item>
                            ))}
                        </Menu.Content>
                    </MenuPositioner>
                </Portal>
            </Menu.Root>

            {/* Model Selector */}
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        borderColor="app.border"
                        color="app.text.primary"
                        _hover={{
                            borderColor: "app.accent",
                            bg: "surface.tertiary"
                        }}
                        disabled={!selectedLLM}
                    >
                        <ChevronDownIcon/>
                        {selectedModel || "Model"}
                    </Button>
                </Menu.Trigger>
                <MenuPositioner>
                    <Menu.Content
                        bg="app.card.bg"
                        borderColor="app.border"
                    >
                        {(selectedLLM === "groq"
                                ? groqModels
                                : selectedLLM === "ollama"
                                    ? ollamaModels
                                    : [...groqModels, ...ollamaModels]
                        ).map((model) => (
                            <Menu.Item
                                value={model}
                                key={model}
                                onClick={() => handleModelSelect(model)}
                                _hover={{bg: "surface.tertiary"}}
                                color="app.text.primary"
                            >
                                {model}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </MenuPositioner>
            </Menu.Root>

            {/* Status Display */}
            {(selectedLLM || selectedModel) && (
                <HStack gap={2}>
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