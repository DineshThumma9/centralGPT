import {HStack} from "@chakra-ui/react";
import {Constants} from "../entities/Constants.ts";
import {llmSelection, modelSelection} from "../api/session-api.ts";
import MenuHelper from "./MenuHelper.tsx";
import useInitStore from "../store/initStore.ts";
import APIKey from "./API-Key.tsx";
import {useEffect} from "react";

const hstack = {
    gap: 1, // Minimal gap for maximum space efficiency
    flexWrap: "wrap",
    margin: "0px",
    p: 1, // Minimal padding for maximum space efficiency
    backdropFilter: "blur(6px)", // Less blur for more transparency
    borderRadius: "md", // Even smaller border radius
    borderColor: "rgba(139, 92, 246, 0.1)", // More subtle
    boxShadow: "0 0 15px rgba(139, 92, 246, 0.05)", // More subtle shadow
    alignItems: "center", // Ensure proper alignment
    ml: 0, // Ensure left alignment
}


const LLMModelChooser = () => {
    const {providers_models, modelsProviders, providers_dic} = Constants();


    const {
        setCurrentLLMProvider,
        setCurrentAPIProvider,
        setCurrentModel,
        setModelMap,
        currentLLMProvider,
        currentAPIProvider,
        setDialogOpen,
        modelMap,
        providerModels,
        currentModel
    } = useInitStore();


    useEffect(() => {
        if (!currentLLMProvider) return;

        const models = providerModels.get(currentLLMProvider) ?? [];
        setModelMap(models);
    }, [currentLLMProvider, providerModels]);

    const handleAPIProviderKeySelection = (currentAPIProvider: string) => {
        setCurrentAPIProvider(currentAPIProvider);
        setDialogOpen(true);
    };

    const handleProviderSelection = async (provider: string) => {
        setCurrentLLMProvider(provider);
        const models = providers_models.get(provider) || [];
        setModelMap(models);
        setCurrentModel("");

        try {
            await llmSelection(provider);

        } catch (error) {
            console.error("Failed to set LLM provider:", error);
        }
    };

    const handleProviderDoubleClick = (provider: string) => {
        // Get the model documentation link for the provider
        const modelLink = providers_dic.get(provider)?.model_link;
        
        if (modelLink) {
            // Open the model documentation page in a new tab
            window.open(modelLink, '_blank', 'noopener,noreferrer');
        }
    };

    const handleModelSelection = async (model: string) => {
        setCurrentModel(model);
        try {
            await modelSelection(model);
        } catch (error) {
            console.error("Failed to set model:", error);
        }
    };

    return (
        <HStack
            {...hstack}
        >

            <MenuHelper
                title={"API Provider"}
                options={modelsProviders}
                selected={currentAPIProvider}
                onSelect={handleAPIProviderKeySelection}
            />

            <MenuHelper
                title={"LLM Providers"}
                options={[...providerModels.keys()]}
                selected={currentLLMProvider}
                onSelect={handleProviderSelection}
                onDoubleClick={handleProviderDoubleClick}
            />

            <MenuHelper
                title={"Models"}
                options={modelMap}
                selected={currentModel}
                onSelect={handleModelSelection}
                disabled={!currentLLMProvider || modelMap.length === 0}
            />


            <APIKey provider={currentAPIProvider} title={"API KEY"}/>
        </HStack>
    );
};

export default LLMModelChooser;