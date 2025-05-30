import {Badge, Button, HStack, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {ChevronDownIcon} from "lucide-react";
import {useState} from "react";
import axios from "axios";
import useSessions from "../hooks/useSessions.ts";
import { Constants } from "../entities/Constants.ts";
import {llmSelection,modelSelection} from "../api/session-api.ts";
import {MenuTrigger} from "./ui/menu.tsx";

const LLMModelChooser = () => {
    const [selectedLLM, setSelectedLLM] = useState("");
    const [selectedModel, setSelectedModel] = useState("");


   const { ollamaModels, apiModels, groqModels, llms } = Constants();

    const handleApiKeySelect = (apiModel: string) => {
        axios
            .post(`http://localhost:8000/api/${apiModel}`)
            .then((res) => console.log(res.data))
            .catch((err) => console.error("Error fetching API key:", err));
    };

    const handleLLMSelect = async (llm: string) => {


        await llmSelection(llm)
        setSelectedLLM(llm);
    };

    const handleModelSelect = async (model: string) => {

        await modelSelection(model)
        setSelectedModel(model);
    };




    return (
        <HStack gap={3} flexWrap="wrap" margin={"0px"}>
            {/* API Key Selector */}
            <Menu.Root >
                <Menu.Trigger asChild>
                    <Button
                        // rightIcon={<ChevronDownIcon/>}
                        variant="outline"
                        size="sm"
                        borderColor="app.border"
                        color="black"
                        bg={"white"}
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
                                    _hover={{bg: "app.text.primary"}}
                                    color="surface.tertiary"
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


                    <MenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                               color="black"
                        bg={"white"}

                            _hover={{
                                color: "app.border",
                                borderColor: "app.text.primary",
                            }}

                        >
                              <ChevronDownIcon/>
                            {selectedLLM || "Provider"}
                        </Button>
                    </MenuTrigger>


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
                            color="black"
                        bg={"white"}
                        borderColor="app.border"

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