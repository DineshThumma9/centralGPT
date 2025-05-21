import {Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
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
        "claudie",
        "gemini",
        "vertex",
        "azure",
        "groq"


    ];
    const ollamaModels: string[] = [


        "qwen3",
        "codegemma:2b",
        "gemma3:4b",
        "llama3.1:latest ",
        "deepseek-coder:6.7b",
        "mistral:latest"
    ]
    const llms: string[] = ["groq", "ollama"];


    return (
        <HStack>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    SET AN API KEY
                </MenuButton>
                <MenuList>
                    {apiModels.map((llm) => (
                        <MenuItem
                            key={llm}
                            onClick={() => {
                                axios
                                    .get(`http://localhost:8000/api/${apikey}`)
                                    .then((res) => console.log(res.data))
                                    .catch((err) => console.error("Error fetching LLM:", err));
                                setSelectedLLM(llm);
                            }}
                        >
                            {llm}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    Choose LLM Provider
                </MenuButton>
                <MenuList>
                    {llms.map((llm) => (
                        <MenuItem
                            key={llm}
                            onClick={() => {
                                axios
                                    .get(`http://localhost:8000/models/${llm}`)
                                    .then((res) => console.log(res.data))
                                    .catch((err) => console.error("Error fetching LLM:", err));
                                setSelectedLLM(llm);
                            }}
                        >
                            {llm}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    Choose Model
                </MenuButton>
                <MenuList>
                    {


                        [...groqModels, ...ollamaModels].map((model) => (
                            <MenuItem
                                key={model}
                                onClick={() => {
                                    axios
                                        .get(`http://localhost:8000/models/model/${model}`)
                                        .then((res) => console.log(res.data))
                                        .catch((err) => console.error("Error fetching model:", err));
                                    setSelectedModel(model);
                                }}
                            >
                                {model}
                            </MenuItem>
                        ))


                    }
                </MenuList>
            </Menu>

            <Text>Selected LLM: {selectedLLM}</Text>
            <Text>Selected Model: {selectedModel}</Text>
        </HStack>
    );
};

export default LLMModelChooser;
