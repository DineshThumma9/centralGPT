const fs = require('fs');
const path = require('path');

// Define color mapping from themeColors.* to new semantic tokens
const themeColorMappings = {
  'themeColors.background.card': '"bg.surface"',
  'themeColors.background.primary': '"bg.canvas"',
  'themeColors.background.body': '"bg.canvas"',
  'themeColors.background.muted': '"bg.muted"',
  'themeColors.background.subtle': '"bg.subtle"',
  'themeColors.background.hover': '"bg.subtle"',
  'themeColors.background.active': '"bg.emphasized"',
  'themeColors.background.accent': '"colorPalette.solid"',
  'themeColors.text.primary': '"fg.default"',
  'themeColors.text.secondary': '"fg.subtle"',
  'themeColors.text.muted': '"fg.muted"',
  'themeColors.text.inverse': '"fg.inverted"',
  'themeColors.border.default': '"border.default"',
  'themeColors.border.subtle': '"border.subtle"',
  'themeColors.border.secondary': '"border.subtle"',
  'themeColors.border.hover': '"border.subtle"',
  'themeColors.border.focus': '"border.accent"',
  'themeColors.shadow.sm': '"sm"',
  'themeColors.shadow.lg': '"lg"'
};

function fixThemeColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace each themeColor mapping
    for (const [oldColor, newToken] of Object.entries(themeColorMappings)) {
      // Handle direct property access: themeColors.background.card
      content = content.replace(new RegExp(`\\b${oldColor.replace(/\./g, '\\.')}\\b`, 'g'), newToken);
      
      // Handle template literals: ${themeColors.background.card}
      content = content.replace(new RegExp(`\\$\\{${oldColor.replace(/\./g, '\\.')}\\}`, 'g'), `\${token(${newToken})}`);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed themeColors in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTsxFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const entries = fs.readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Process all files in src/components
const componentsDir = path.join(__dirname, 'src', 'components');
const files = findTsxFiles(componentsDir);

console.log(`Processing ${files.length} files for themeColors...`);

let fixedCount = 0;
for (const file of files) {
  if (fixThemeColorsInFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Complete! Fixed themeColors in ${fixedCount} files.`);
