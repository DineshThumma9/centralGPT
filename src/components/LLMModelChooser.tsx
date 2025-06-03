import {HStack} from "@chakra-ui/react";
import {Constants} from "../entities/Constants.ts";
import {llmSelection, modelSelection} from "../api/session-api.ts";
import MenuHelper from "./MenuHelper.tsx";
import useInitStore from "../store/initStore.ts";
import BadgeCompo from "./BadgeCompo.tsx";
import APIKey from "./API-Key.tsx";
import {useEffect} from "react";
import axios from "axios";

const LLMModelChooser = () => {
    const {providers_models, modelsProviders} = Constants();

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

        // Reset current model when switching providers
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
        <HStack gap={3} flexWrap="wrap" margin={"0px"}>
            {/* API Provider Selector */}
            <MenuHelper
                title={"API Provider"}
                options={modelsProviders}
                selected={currentAPIProvider}
                onSelect={handleAPIProviderKeySelection}
            />

            {/* LLM Providers Selector */}
            <MenuHelper
                title={"LLM Providers"}
                options={[...providerModels.keys()]}
                selected={currentLLMProvider}
                onSelect={handleProviderSelection}
            />

            {/* Models Selector */}
            <MenuHelper
                title={"Models"}
                options={modelMap}
                selected={currentModel}
                onSelect={handleModelSelection}
                disabled={!currentLLMProvider || modelMap.length === 0}
            />

            {/* Status Display */}
            {(currentLLMProvider || currentModel) && (
                <HStack gap={2}>
                    {currentLLMProvider && (
                        <BadgeCompo label={currentLLMProvider} key={`provider-${currentLLMProvider}`}/>
                    )}
                    {currentModel && (
                        <BadgeCompo label={currentModel} key={`model-${currentModel}`}/>
                    )}
                </HStack>
            )}

            <APIKey provider={currentAPIProvider} title={"API KEY"}/>
        </HStack>
    );
};

export default LLMModelChooser;