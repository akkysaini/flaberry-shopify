import fs from 'node:fs';

const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

// Find major section markers
const lines = html.split('\n');
console.log('Total lines in prototype:', lines.length);

const sectionHeaders = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('class="sec-') || line.includes('class="section') || line.includes('<section') || line.includes('<!-- ===')) {
    sectionHeaders.push(`${i + 1}: ${line.trim()}`);
  }
}
console.log('Major Section Markers:');
console.log(sectionHeaders.slice(0, 40).join('\n'));
