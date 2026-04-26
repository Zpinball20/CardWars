const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const ASSETS_DIR = path.join(PROJECT_ROOT, 'db', 'assets', 'textures');
const CARDS_DIR = path.join(ASSETS_DIR, 'cards');
const HEROES_DIR = path.join(ASSETS_DIR, 'heroes');
const LANDSCAPES_DIR = path.join(ASSETS_DIR, 'landscapes');

function toFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function downloadImage(url, filepath) {
  try {
    if (fs.existsSync(filepath)) return true;
    
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000
    });
    
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filepath);
      response.data.pipe(stream)
        .on('finish', () => resolve(true))
        .on('error', () => resolve(false));
    });
  } catch (e) {
    return false;
  }
}

async function scrape(id) {
  try {
    const response = await axios.get(`https://www.carddweeb.com/Card?id=${id}`, { timeout: 5000 });
    const html = response.data;
    
    const imgMatch = html.match(/src="(\/CardImages\/regular\/[^"]+\.png)"/);
    if (!imgMatch) return null;
    
    return {
      imgUrl: 'https://www.carddweeb.com' + imgMatch[1],
      cardName: imgMatch[1].split('/').pop().replace('.png', '').replace(/_/g, ' ')
    };
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log('Scanning...');
  
  for (let id = 0; id <= 200; id++) {
    process.stdout.write(`\rID ${id}...`);
    const result = await scrape(id);
    if (!result) continue;
    
    const filename = toFilename(result.cardName) + '.png';
    
    // Hero check (Finn, Jake, etc.)
    if (result.cardName === 'Finn' || result.cardName === 'Jake') {
      await downloadImage(result.imgUrl, path.join(HEROES_DIR, filename));
      console.log(`Hero: ${filename}`);
      continue;
    }
    
    // Landscape check
    if (result.cardName.includes('Plains') || result.cardName.includes('Field') || result.cardName.includes('Rainbow')) {
      await downloadImage(result.imgUrl, path.join(LANDSCAPES_DIR, filename));
      console.log(`Landscape: ${filename}`);
      continue;
    }
    
    // Card
    await downloadImage(result.imgUrl, path.join(CARDS_DIR, filename));
  }
  
  console.log('\nDone!');
}

run();