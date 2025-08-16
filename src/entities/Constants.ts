export const Constants = () => {
  const togetherModels: string[] = [
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "meta-llama/Llama-3.1-405B-Turbo",
    "mistralai/Mixtral-8x7B-Instruct-v0.1",
    "deepseek-ai/DeepSeek-V3-0324",
    "gemma/Gemma-3-27B",
       "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
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
  "magistral-medium",
  "magistral-small",
  "mistral-medium",
  "mistral-large",
  "pixtral-large",
  "mistral-moderation",
  "ministral-3b",
  "ministral-8b",
  "open-mistral-nemo",
  "mistral-small",
  "devstral-small",
  "devstral-medium",
  "mistral-saba",
  "codestral",
  "mistral-ocr",
  "voxtral-small",
  "voxtral-mini"
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
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
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

const providers_api_link = new Map<string, string>([
  ["groq", "https://console.groq.com/keys"],
  ["ollama", ""],
  ["together", "https://api.together.xyz/settings/api-keys"],
  ["mistral", "https://console.mistral.ai/api-keys"],
  ["openai", "https://platform.openai.com/api-keys"],
  ["deepseek", "https://platform.deepseek.com/api_keys"],
  ["gemini", "https://aistudio.google.com/app/apikey"],
  ["openrouter", "https://openrouter.ai/settings/keys"],
]);

const api_providers_models = new Map<string, string >([
  ["groq", "https://console.groq.com/docs/models"],
  ["ollama", "https://ollama.com/library?sort=newest"],
  ["together", "https://api.together.xyz/models"],
  ["mistral", "https://docs.mistral.ai/getting-started/models/models_overview/"],
  ["openai", "https://platform.openai.com/docs/models"],
  ["deepseek", "https://api-docs.deepseek.com/quick_start/pricing"],
  ["gemini", "https://ai.google.dev/gemini-api/docs/models"],
  ["openrouter", "https://openrouter.ai/models"],
]);


type ProviderInfo = {
  models: unknown;   // Replace `unknown` with the actual models type
  api_link: string;
  model_link: string;
};

const providers_dic = new Map<string, ProviderInfo>([
  ["groq", {
    models: groqModels,
    api_link: providers_api_link.get("groq")!,
    model_link: api_providers_models.get("groq")!
  }],
  ["ollama", {
    models: ollamaModels,
    api_link: providers_api_link.get("ollama")!,
    model_link: api_providers_models.get("ollama")!
  }],
  ["together", {
    models: togetherModels,
    api_link: providers_api_link.get("together")!,
    model_link: api_providers_models.get("together")!
  }],
  ["deepInfra", {
    models: deepInfraModels,
    api_link: "",
    model_link: ""
  }],
  ["mistral", {
    models: mistralModels,
    api_link: providers_api_link.get("mistral")!,
    model_link: api_providers_models.get("mistral")!
  }],
  ["openai", {
    models: openaiModels,
    api_link: providers_api_link.get("openai")!,
    model_link: api_providers_models.get("openai")!
  }],
  ["qwen", {
    models: qwenModels,
    api_link: providers_api_link.get("qwen")!,
    model_link: api_providers_models.get("qwen")!
  }],
  ["deepseek", {
    models: deepseekModels,
    api_link: providers_api_link.get("deepseek")!,
    model_link: api_providers_models.get("deepseek")!
  }],
  ["gemini", {
    models: geminiModels,
    api_link: providers_api_link.get("gemini")!,
    model_link: api_providers_models.get("gemini")!
  }],
  ["openrouter", {
    models: openrouterModels,
    api_link: providers_api_link.get("openrouter")!,
    model_link: api_providers_models.get("openrouter")!
  }],
]);


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
    providers_dic,
    providers_api_link,
    providers_models,
    ollamaModels,
    groqModels,
    openrouterModels,
    modelsProviders,

  };
};
