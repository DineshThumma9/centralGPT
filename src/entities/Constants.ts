export const Constants = () => {
  const togetherModels: string[] = [
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "meta-llama/Llama-3.1-405B-Turbo",
    "mistralai/Mixtral-8x7B-Instruct-v0.1",
    "deepseek-ai/DeepSeek-V3-0324",
    "gemma/Gemma-3-27B",
    "togethercomputer/StripedHyena-Nous-7B",
    "togethercomputer/RedPajama-INCITE-Chat-3B-v1",
      "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
  ];

  const deepInfraModels: string[] = [
    "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    "deepseek-ai/DeepSeek-V3",
    "cognitivecomputations/Dolphin-2.6-Mixtral-8x7B",
    "black-forest-labs/FLUX-pro",
  ];

  const mistralModels: string[] = [
    "mistral-small",
    "mistral-medium",
    "mistral-large",
  ];

  const openaiModels: string[] = [
    "gpt-4o",
    "gpt-4.1",
    "gpt-3.5-turbo",
    "gpt-o1",
  ];

  const qwenModels: string[] = [
    "Qwen3-0.6B",
    "Qwen3-1.7B",
    "Qwen3-4B",
    "Qwen3-8B",
    "Qwen3-14B",
    "Qwen3-32B",
    "Qwen3-72B-Instruct",
    "Qwen3-235B",
    "QwQ-32B",
  ];

  const deepseekModels: string[] = [
    "deepseek-r1",
    "deepseek-v3",
    "deepseek-v3-0324",
  ];

  const geminiModels: string[] = [
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  const groqModels: string[] = [
    "qwen-qwq-32b",
    "compound-beta",
    "gemma2-9b-it",
    "compound-beta-mini",
    "llama3-70b-8192",
    "llama-3.1-8b-instant",
    "meta-llama/Llama-Guard-4-12",
  ];

  const openrouterModels: string[] = [
    "meta-llama/llama-4-maverick",
    "meta-llama/llama-4-scout",
    "moonshotai/kimi-vl-a3b-thinking",
    "nvidia/llama-3.1-nemotron-nano-8b-v1",
    "google/gemini-2.5-pro-exp-03-25",
    "mistralai/mistral-small-3.1-24b-instruct",
    "openrouter/optimus-alpha",
    "openrouter/quasar-alpha",
    "deepseek/deepseek-v3-base",
    "qwen/qwen2.5-vl-3b-instruct",
    "deepseek/deepseek-chat-v3-0324",
    "deepseek/deepseek-r1-zero",
    "nousresearch/deephermes-3-llama-3-8b-preview",
  ];
  const modelsProviders: string[] = [
    "openai",
    "claude",
    "gemini",
    "vertex",
    "azure",
    "GROQ",
    "openrouter",
      "mistral",
      "deepinfra",
      "together"
  ];

  const ollamaModels: string[] = [
    "qwen3",
    "codegemma:2b",
    "gemma3:4b",
    "llama3.1:latest",
    "deepseek-coder:6.7b",
    "mistral:latest",
  ];

  const llms: string[] = ["groq", "ollama", "openrouter"];



 const  providers_models = new Map<string, string[]>([
  ["groq", groqModels],
  ["ollama", ollamaModels],
  ["together", togetherModels],
  ["deepInfra", deepInfraModels],
  ["mistral", mistralModels],
  ["openai", openaiModels],
  ["qwen", qwenModels],
  ["deepseek", deepseekModels],
  ["gemini", geminiModels],
  ["openrouter", openrouterModels],
]);


  return {
    llms,
    ollamaModels,
    groqModels,
    openrouterModels,
    modelsProviders,
    providers_models,
  };
};
