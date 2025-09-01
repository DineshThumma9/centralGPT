const fs = require('fs');
const path = require('path');

// Find all TypeScript/JSX files that import ColorModeContext
const findFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('ColorModeContext')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
};

// List of files to migrate
const files = findFiles('./src');
console.log('Files using ColorModeContext:');
files.forEach(file => console.log(file));

// Migration function
const migrateFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove ColorModeContext import
  content = content.replace(
    /import\s*{\s*useColorMode\s*}\s*from\s*['"](\.\.?\/)*contexts\/ColorModeContext['"]\s*;?\s*/g, 
    ''
  );
  
  // Remove the useColorMode hook usage
  content = content.replace(
    /const\s*{\s*([^}]*)\s*}\s*=\s*useColorMode\(\)\s*;?\s*/g,
    ''
  );
  
  // Replace colorMode === 'light' with semantic token equivalents
  content = content.replace(
    /colorMode\s*===\s*['"']light['"']\s*\?\s*([^:]+)\s*:\s*([^,\s\}]+)/g,
    '{ base: $1, _dark: $2 }'
  );
  
  // Replace colorMode === 'dark' with semantic token equivalents  
  content = content.replace(
    /colorMode\s*===\s*['"']dark['"']\s*\?\s*([^:]+)\s*:\s*([^,\s\}]+)/g,
    '{ base: $2, _dark: $1 }'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Migrated: ${filePath}`);
};

// Run migration on all files
files.forEach(migrateFile);

console.log('Migration complete!');
