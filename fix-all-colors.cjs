const fs = require('fs');
const path = require('path');

// Define color mapping from old colors.* to new semantic tokens
const colorMappings = {
  'colors.background.card': '"bg.surface"',
  'colors.background.primary': '"bg.canvas"',
  'colors.background.body': '"bg.canvas"',
  'colors.background.muted': '"bg.muted"',
  'colors.background.subtle': '"bg.subtle"',
  'colors.background.hover': '"bg.subtle"',
  'colors.background.active': '"bg.emphasized"',
  'colors.background.accent': '"colorPalette.solid"',
  'colors.text.primary': '"fg.default"',
  'colors.text.secondary': '"fg.subtle"',
  'colors.text.muted': '"fg.muted"',
  'colors.text.inverse': '"fg.inverted"',
  'colors.border.default': '"border.default"',
  'colors.border.subtle': '"border.subtle"',
  'colors.border.secondary': '"border.subtle"',
  'colors.border.hover': '"border.subtle"',
  'colors.border.focus': '"border.accent"',
  'colors.shadow.sm': '"sm"',
  'colors.shadow.lg': '"lg"'
};

function fixColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace each color mapping
    for (const [oldColor, newToken] of Object.entries(colorMappings)) {
      // Handle direct property access: colors.background.card
      content = content.replace(new RegExp(`\\b${oldColor.replace(/\./g, '\\.')}\\b`, 'g'), newToken);
      
      // Handle template literals: ${colors.background.card}
      content = content.replace(new RegExp(`\\$\\{${oldColor.replace(/\./g, '\\.')}\\}`, 'g'), `\${token(${newToken})}`);
    }
    
    // Special case for border styles with colors
    content = content.replace(/border:\s*`1px solid \${colors\.border\.default}`/g, 'border: "1px solid token(colors.border.default)"');
    content = content.replace(/border=\{`1px solid \${colors\.border\.default}`\}/g, 'border="1px solid" borderColor="border.default"');
    
    // Fix malformed template literal in AIResponse
    content = content.replace(/border:\s*`1px solid \{colors\.border\.subtle\}`/g, 'border: "1px solid" borderColor="border.subtle"');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed colors in: ${filePath}`);
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

console.log(`Processing ${files.length} files...`);

let fixedCount = 0;
for (const file of files) {
  if (fixColorsInFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Complete! Fixed colors in ${fixedCount} files.`);
