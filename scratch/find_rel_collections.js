const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const queries = ['for-her', 'for-him', 'red-flowers', 'pink-flowers', 'same-day'];
queries.forEach(q => {
  let pos = 0;
  let count = 0;
  while ((pos = proto.indexOf(q, pos)) !== -1) {
    if (pos > 10240000) {
      count++;
      console.log(`[${q}] at ${pos}: ...${proto.slice(Math.max(0, pos - 40), Math.min(proto.length, pos + 60)).replace(/\r?\n/g, ' ')}...`);
    }
    pos += q.length;
  }
});
