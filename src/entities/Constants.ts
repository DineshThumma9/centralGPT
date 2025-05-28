


export const Constants = () => {

        const groqModels: string[] = [
        "qwen-qwq-32b",
        "compound-beta",
        "gemma2-9b-it",
        "compound-beta-mini",
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

