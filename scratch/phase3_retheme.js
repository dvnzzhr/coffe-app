const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Regex to match tailwind classes: e.g., bg-blue-600, text-blue-500/20, hover:bg-blue-700
      const classRegex = /\b(text|bg|border|ring|shadow|from|to|via)-blue-(\d{2,3})(\/\d{1,2})?\b/g;
      const patchedContent = content.replace(classRegex, (match, p1, p2, p3) => {
        return `${p1}-pink-${p2}${p3 || ''}`;
      });

      if (patchedContent !== content) {
        fs.writeFileSync(fullPath, patchedContent, 'utf8');
        console.log(`Replaced colors in ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\app');
processDir('c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\components');
