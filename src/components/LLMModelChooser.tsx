// ===================================

// Updated LLMModelChooser.tsx with Purple-Violet Theme
import {HStack} from "@chakra-ui/react";
import {Constants} from "../entities/Constants.ts";
import {llmSelection, modelSelection} from "../api/session-api.ts";
import MenuHelper from "./MenuHelper.tsx";
import useInitStore from "../store/initStore.ts";
import BadgeCompo from "./BadgeCompo.tsx";
import APIKey from "./API-Key.tsx";
import {useEffect} from "react";

import useSessionStore from "../store/sessionStore.ts";


const hstack = {
    gap: 3,
    flexWrap: "wrap",
    margin: "0px",
    p: 4,
    backdropFilter: "blur(10px)",
    borderRadius: "xl",
    // border:"1px solid"
    borderColor: "rgba(139, 92, 246, 0.2)",
    boxShadow: "0 0 30px rgba(139, 92, 246, 0.1)"
}




const LLMModelChooser = () => {
    const {providers_models, modelsProviders} = Constants();
    const {shouldStream} = useSessionStore();


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
            />

            <MenuHelper
                title={"Models"}
                options={modelMap}
                selected={currentModel}
                onSelect={handleModelSelection}
                disabled={!currentLLMProvider || modelMap.length === 0}
            />

            {(currentLLMProvider || currentModel || shouldStream) && (
                <HStack gap={2}>
                    {currentLLMProvider && <BadgeCompo label={currentLLMProvider}/>}
                    {currentModel && <BadgeCompo label={currentModel}/>}
                </HStack>
            )}




            <APIKey provider={currentAPIProvider} title={"API KEY"}/>
        </HStack>
    );
};

export default LLMModelChooser;