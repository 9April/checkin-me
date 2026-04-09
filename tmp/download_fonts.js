const fs = require('fs');
const https = require('https');
const path = require('path');

const fonts = {
  regular: 'https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Regular.ttf',
  bold: 'https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Bold.ttf'
};

async function downloadAndEncode(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return https.get(res.headers.location, (res2) => {
          const chunks = [];
          res2.on('data', chunk => chunks.push(chunk));
          res2.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        }).on('error', reject);
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading fonts...');
  try {
    const regularB64 = await downloadAndEncode(fonts.regular);
    const boldB64 = await downloadAndEncode(fonts.bold);
    
    const content = \`export const montserratRegular = "\${regularB64}";\\nexport const montserratBold = "\${boldB64}";\\n\`;
    const dir = path.join(__dirname, '../lib');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'fonts.ts'), content);
    console.log('Successfully created fonts.ts!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
