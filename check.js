const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/g;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  try {
    new Function(match[1]);
    console.log('Script block OK');
  } catch (e) {
    console.error('Syntax error found:');
    console.error(e.message);
    const lines = match[1].split('\n');
    // We can't easily map back to HTML lines without more work, but just getting the syntax error is enough
  }
}
