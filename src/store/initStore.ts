import { create } from 'zustand';
import {Constants} from "../entities/Constants.ts"




const {providers_models} = Constants()
export type InitState = {
  currentLLMProvider: string;
  currentModel: string;
  modelMap:string[]
  currentAPIProvider: string;
  currentAPIKey: string;
  dialogOpen:boolean
  providerModels:Map<string,string[]>


  setCurrentLLMProvider: (llm: string) => void;
  setModelMap:(modelMap:string[]) => void;
  setCurrentModel: (model: string) => void;
  setDialogOpen:(open:boolean) => void
  setCurrentAPIProvider: (provider: string) => void;
  setCurrentAPIKey: (key: string) => void;
};

export const useInitStore = create<InitState>((set) => ({
  currentLLMProvider: '',
  currentModel: '',
  currentAPIProvider: '',
  currentAPIKey: '',
  dialogOpen:false,
  modelMap:[],
  providerModels:providers_models,

  setCurrentLLMProvider: (provider) => set({ currentLLMProvider: provider }),
  setModelMap:(modelMap:string[]) => set({modelMap:modelMap}),
  setCurrentModel: (model) => set({ currentModel:model }),
  setDialogOpen:(open:boolean) => set({dialogOpen:open}),
  setCurrentAPIProvider: (provider) => set({ currentAPIProvider: provider }),
  setCurrentAPIKey: (key) => set({ currentAPIKey: key }),
}));



export default useInitStore;
