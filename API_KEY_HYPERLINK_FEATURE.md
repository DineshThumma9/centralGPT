# API Key Dialog Hyperlink Feature

## 🎯 **Feature Added**: Clickable Provider Links in API Key Dialog

### ✅ **What's New**

When users click on the API Key button and the dialog opens, the provider name (e.g., "gemini", "openai", "groq") is now a **clickable hyperlink** that redirects users to the API key page of that provider.

### 🔧 **Implementation Details**

**File Modified**: `src/components/API-Key.tsx`

#### **Key Changes:**

1. **Added Imports:**
   ```tsx
   import {Constants} from "../entities/Constants.ts";
   import {ExternalLink} from "lucide-react";
   ```

2. **Dynamic API Link Retrieval:**
   ```tsx
   const constants = Constants();
   const apiLink = constants.providers_api_link.get(provider.toLowerCase());
   ```

3. **Enhanced Dialog Title:**
   - Provider name is now a clickable link (when API link is available)
   - Added external link icon for visual clarity
   - Includes hover effects and smooth transitions
   - Added helpful subtitle text

#### **Visual Features:**

- **Clickable Link**: Provider name becomes a blue underlined link
- **External Link Icon**: Small icon (🔗) next to provider name
- **Hover Effects**: 
  - Color changes on hover
  - Slight scale animation (1.02x)
  - Smooth transitions
- **Helper Text**: "Click [provider] above to get your API key"

### 🔗 **Supported Providers with Links**

Based on your Constants file, these providers have clickable links:

| Provider | API Key URL |
|----------|-------------|
| **groq** | https://console.groq.com/keys |
| **together** | https://api.together.xyz/settings/api-keys |
| **mistral** | https://console.mistral.ai/api-keys |
| **openai** | https://platform.openai.com/api-keys |
| **deepseek** | https://platform.deepseek.com/api_keys |
| **gemini** | https://aistudio.google.com/app/apikey |
| **openrouter** | https://openrouter.ai/settings/keys |

**Note**: `ollama` doesn't have a link as it's a local provider.

### 🎨 **User Experience**

#### **Before:**
```
Enter Your API Key-gemini
[Just plain text]
```

#### **After:**
```
Enter Your API Key-[gemini 🔗]
Click "gemini" above to get your API key

[Where "gemini" is a clickable blue link]
```

### 🧪 **How to Test**

1. Go to your app at `http://localhost:5174/`
2. Click on any API Key button
3. In the dialog that opens:
   - **Provider name should be a blue underlined link**
   - **External link icon should be visible**
   - **Clicking the provider name opens the API key page in a new tab**
   - **Helper text should appear below the title**

### 🚀 **Benefits**

1. **Seamless UX**: Users can get their API key without leaving the app context
2. **Clear Visual Cues**: External link icon and styling make it obvious it's clickable
3. **New Tab Opening**: Preserves the app state while opening API provider page
4. **Graceful Fallback**: If no API link exists, shows plain text instead
5. **Consistent Theming**: Uses your app's semantic tokens for colors

The feature integrates seamlessly with your existing green theme and provides a much better user experience for API key management! 🌟
