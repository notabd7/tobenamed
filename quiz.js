require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');
const StreamZip = require('node-stream-zip');
// Import the extractTextFromPPTX function from your existing file
const { extractTextFromPPTX, getChatGPTSummary } = require('./bulletPoints.js');

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
            content: `Based on the following content, generate multiple-choice questions that cover the whole topic. Each question should have 4 options (A, B, C, D) with one correct answer. Format your response as a JSON array of objects, where each object represents a question with properties: question, options (an array of 4 strings), and correctAnswer (the letter of the correct option).
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
    console.log('Raw API Response:', response.data.choices[0].message.content);
    try {
      return JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Response content:', response.data.choices[0].message.content);
      return null;
    }
  } catch (error) {
    console.error('Error in OpenAI API request:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return null;
  }
}

async function createQuizFromFile(filePath) {
  try {
    
    let textContent;
    if (filePath.endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      textContent = data.text;
    } else if (filePath.endsWith('.txt')) {
      textContent = fs.readFileSync(filePath, 'utf-8');
    } else if (filePath.endsWith('.pptx')) {
      textContent = await extractTextFromPPTX(filePath);
    } else {
      console.error('Unsupported file format. Please use a .pdf, .txt, or .pptx file.');
      return;
    }
    summary = getChatGPTSummary(textContent)
    const quiz = await generateQuiz(textContent, summary);
    console.log("sum", summary)
    if (quiz) {
      console.log(JSON.stringify(quiz, null, 2));
      return quiz;
      
    } else {
      console.log('Failed to generate quiz. Please check the error logs.');
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
  }
}

// Example usage
const filePath = 'samples/CS3060 OL Sensing.pptx';
createQuizFromFile(filePath);
