# Provider Documentation Links Feature

## 🎯 **Feature Added**: Double-Click Provider Links in LLMModelChooser

### ✅ **What's New**

Users can now **double-click on any LLM provider** in the "LLM Providers" dropdown to be redirected to that provider's model documentation page in a new tab.

### 🔧 **Implementation Details**

#### **Files Modified:**

1. **`src/components/MenuHelper.tsx`**
   - Added optional `onDoubleClick` prop for handling double-click events
   - Added tooltip text: "Double-click to view documentation"
   - Enhanced cursor styling for interactive items

2. **`src/components/LLMModelChooser.tsx`**
   - Added `handleProviderDoubleClick` function that opens provider model documentation
   - Uses `providers_dic` to get the correct model link for each provider
   - Passes double-click handler to **LLM Providers** MenuHelper (not Models)

3. **`src/components/API-Key.tsx`**
   - Removed helper text "Click [provider] above to get your API key" as requested
   - Kept the clickable provider link functionality

### 🎯 **How It Works**

1. **Open LLM Providers Dropdown**: Click on the "LLM Providers" dropdown
2. **Double-Click Any Provider**: Double-click on any provider name (groq, openai, gemini, etc.)
3. **Documentation Opens**: Provider's model documentation page opens in a new tab
4. **Continue Workflow**: Single-click still selects the provider normally

### 🔗 **Supported Provider Documentation Links**

Based on your Constants configuration:

| Provider | Model Documentation URL |
|----------|-------------------------|
| **groq** | https://console.groq.com/docs/models |
| **ollama** | https://ollama.com/library?sort=newest |
| **together** | https://api.together.xyz/models |
| **mistral** | https://docs.mistral.ai/getting-started/models/models_overview/ |
| **openai** | https://platform.openai.com/docs/models |
| **deepseek** | https://api-docs.deepseek.com/quick_start/pricing |
| **gemini** | https://ai.google.dev/gemini-api/docs/models |
| **openrouter** | https://openrouter.ai/models |

### 🎨 **User Experience**

#### **Visual Cues:**
- **Tooltip**: Hovering over provider items shows "Double-click to view documentation"
- **Cursor**: Pointer cursor indicates clickable items
- **New Tab**: Links open in new tab, preserving app context

#### **Interaction Flow:**
1. **Single-click provider** → Selects the provider and loads its models (existing functionality)
2. **Double-click provider** → Opens provider's model documentation page (new functionality)

### 🧪 **How to Test**

1. Go to your app at `http://localhost:5174/`
2. Click on the **"LLM Providers"** dropdown
3. Double-click on any provider name (e.g., "groq", "openai", "gemini")
4. **Expected result**: Provider's model documentation page opens in a new tab

### 🚀 **Benefits**

1. **Quick Access**: Instant access to provider's model documentation
2. **Better UX**: No need to manually search for model information
3. **Contextual**: Opens the right documentation for each provider
4. **Non-Intrusive**: Single-click still works for provider selection
5. **Logical Placement**: Double-click on provider opens provider documentation

### 🎯 **Example Usage**

```
1. Open "LLM Providers" dropdown
2. Double-click on "groq"
3. → Opens https://console.groq.com/docs/models in new tab
4. → Shows all Groq models and their capabilities
```

**Note**: This is different from the Models dropdown, which is for selecting specific models after choosing a provider.

The feature now correctly places the documentation link at the provider level, where it makes more logical sense! 🌟
