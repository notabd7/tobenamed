const fs = require('fs');
const pdf = require('pdf-parse');
const StreamZip = require('node-stream-zip');

async function extractTextFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileExtension = filePath.split('.').pop().toLowerCase();

  switch (fileExtension) {
    case 'pdf':
      return extractTextFromPDF(filePath);
    case 'txt':
      return extractTextFromTXT(filePath);
    case 'pptx':
      return extractTextFromPPTX(filePath);
    default:
      throw new Error('Unsupported file format. Please use a .pdf, .txt, or .pptx file.');
  }
}

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

function extractTextFromTXT(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

async function extractTextFromPPTX(filePath) {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({
      file: filePath,
      storeEntries: true
    });
    zip.on('ready', () => {
      let slideTexts = [];
      const entries = Object.values(zip.entries());
      const slideEntries = entries.filter(entry => entry.name.startsWith('ppt/slides/slide'));
      slideEntries.forEach(entry => {
        const slideContent = zip.entryDataSync(entry).toString('utf8');
        const textMatches = slideContent.match(/<a:t>(.+?)<\/a:t>/g) || [];
        const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join(' ');
        slideTexts.push(slideText);
      });
      zip.close();
      resolve(slideTexts.join('\n\n'));
    });
    zip.on('error', reject);
  });
}

module.exports = { extractTextFromFile };