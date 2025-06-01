import {HStack} from "@chakra-ui/react";
import {Constants} from "../entities/Constants.ts";
import {llmSelection, modelSelection} from "../api/session-api.ts";
import MenuHelper from "./MenuHelper.tsx";
import useInitStore from "../store/initStore.ts";
import BadgeCompo from "./BadgeCompo.tsx";
import APIKey from "./API-Key.tsx";

const LLMModelChooser = () => {



    const {providers_models,modelsProviders} = Constants();

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
    } = useInitStore()

   const handleAPIProviderKeySelection = (currentAPIProvider:string) => {
        setCurrentAPIProvider(currentAPIProvider)
       setDialogOpen(true)
   }

   const handleProviderSelection = async (providers:string) => {


        setCurrentLLMProvider(providers)
        setModelMap(providers_models.get(providers) || [])
        await llmSelection(providers)

   }

   const handleModelSelection= async (model:string) => {
        setCurrentModel(model)
        await modelSelection(model)

   }


    return (

        <HStack gap={3} flexWrap="wrap" margin={"0px"}>
            {/* API Key Selector */}

            <MenuHelper
                title={"API Provider"}
                options={modelsProviders}
                selected={currentAPIProvider}
                onSelect={
                handleAPIProviderKeySelection
            } />

            <MenuHelper
                title={"LLM Providers"}
                options={[...providerModels.keys()]}
                // options={["fdff","ffff"]}
                selected={currentLLMProvider}
                onSelect={handleProviderSelection}
            />
            <MenuHelper
                title={"Models"}
                options={modelMap}
                selected={currentModel}
                onSelect={handleModelSelection}
            />


            {/* Status Display */}
            {(currentLLMProvider || currentModel ) && (
                <HStack gap={2}>
                    {
                        currentLLMProvider && (
                        <BadgeCompo label = {currentLLMProvider}/>
                    )}
                    {currentModel && (
                        <BadgeCompo label = {currentModel}/>
                    )}
                </HStack>
            )}

            <APIKey  provider={currentAPIProvider} title={"API KEY"} />

        </HStack>
    );

};

export default LLMModelChooser;