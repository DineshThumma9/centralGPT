// Script to remove console.log statements from TypeScript files
const fs = require('fs');
const path = require('path');

const files = [
    'src/hooks/useSessions.ts',
    'src/hooks/useMessage.ts',
    'src/components/SessionComponent.tsx'
];

files.forEach(filePath => {
    try {
        const fullPath = path.join(__dirname, filePath);
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Remove console.log statements (both single and multi-line)
        content = content.replace(/\s*console\.log\([^;]*?\);?\s*/g, '');
        content = content.replace(/\s*console\.log\([^)]*\)[^;]*;?\s*/g, '');
        
        // Clean up extra empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Cleaned ${filePath}`);
    } catch (error) {
        console.log(`❌ Error cleaning ${filePath}: ${error.message}`);
    }
});

console.log('Console.log cleanup complete!');
