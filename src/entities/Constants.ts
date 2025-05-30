


export const Constants = () => {

        const groqModels: string[] = [
        "qwen-qwq-32b",
        "compound-beta",
        "gemma2-9b-it",
        "compound-beta-mini",
            "llama3-70b-8192",
            "llama-3.1-8b-instant",
            "meta-llama/Llama-Guard-4-12",

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

    const llms: string[] = ["groq", "ollama"]


    return {llms,ollamaModels,groqModels,apiModels}

}

