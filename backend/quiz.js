require('dotenv').config();
const axios = require('axios');

// Import the extractTextFromPPTX function from your existing file


const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the .env file');
  process.exit(1);
}

async function generateQuiz(textContent, summary) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates multiple-choice quiz questions.'
          },
          {
            role: 'user',
            content: `Based on the following content, generate multiple-choice questions that cover the whole topic. Each question should have 4 options with one correct answer. Format your response as a JSON array of objects, where each object represents a question with properties: question, options (an array of 4 strings dont include the letters for the options like 'A', 'B', 'C', 'D'), and correctAnswer.
            Content: ${textContent}
            Summary: ${summary}
            Generate the quiz questions:`
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    let content = response.data.choices[0].message.content;
    console.log('Raw API Response:', content);

    // Remove any potential markdown formatting
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Cleaned response content:', content);
      return { error: 'Failed to parse quiz data', rawContent: content };
    }
  } catch (error) {
    console.error('Error in OpenAI API request:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return { error: 'Failed to generate quiz', details: error.message };
  }
}

module.exports = { generateQuiz };
// async function createQuizFromFile(filePath) {
//   try {
    
//     // let textContent;
//     // if (filePath.endsWith('.pdf')) {
//     //   const dataBuffer = fs.readFileSync(filePath);
//     //   const data = await pdf(dataBuffer);
//     //   textContent = data.texts;
//     // } else if (filePath.endsWith('.txt')) {
//     //   textContent = fs.readFileSync(filePath, 'utf-8');
//     // } else if (filePath.endsWith('.pptx')) {
//     //   textContent = await extractTextFromPPTX(filePath);
//     // } else {
//     //   console.error('Unsupported file format. Please use a .pdf, .txt, or .pptx file.');
//     //   return;
//     // }

//     //textContent = extractTextFomFile(filePath)
//     //summary = getChatGPTSummary(textContent)
//     const quiz = await generateQuiz(textContent, summary);
//     console.log("sum", summary)
//     if (quiz) {
//       console.log(JSON.stringify(quiz, null, 2));
//       return quiz;
      
//     } else {
//       console.log('Failed to generate quiz. Please check the error logs.');
//     }
//   } catch (error) {
//     console.error('Error creating quiz:', error);
//   }
// }

// // Example usage
// const filePath = './samples/s1.pptx';
// createQuizFromFile(filePath);
