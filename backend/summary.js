require('dotenv').config();
const axios = require('axios');


// Get the API key from the .env file
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the .env file');
  process.exit(1);
}


async function getChatGPTSummary(textContent) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text in an accurate and precise manner.'
          },
          {
            role: 'user',
            content: `Return me a summary in the form of short concise and informative paragraphs that cover the whole topic: ${textContent}`
          }
        ],
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API request:', error.response ? error.response.data : error.message);
  }
}


// async function summarizeFile(filePath) {
//   try {
//     let textContent;

//     if (filePath.endsWith('.pdf')) {
//       const dataBuffer = fs.readFileSync(filePath);
//       const data = await pdf(dataBuffer);
//       textContent = data.text;
//     } else if (filePath.endsWith('.txt')) {
//       textContent = fs.readFileSync(filePath, 'utf-8');
//     } else if (filePath.endsWith('.pptx')) {
//       textContent = await extractTextFromPPTX(filePath);
//     } else {
//       console.error('Unsupported file format. Please use a .pdf, .txt, or .pptx file.');
//       return;
//     }

//     return getChatGPTSummary(textContent);
//   } catch (error) {
//     console.error('Error processing file:', error);
//   }
// }

// Example usage
// const filePath = 'CS3060 OL Sensing.pptx'; // Replace with path to your .txt, .pdf, or .pptx file
// summarizeFile(filePath)

module.exports = {
  getChatGPTSummary
};
