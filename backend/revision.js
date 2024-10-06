require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the .env file');
  process.exit(1);
}

async function generateRevision(wrongAnswers) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that uses the questions the user got wrong answers on and tells a subtopic the mistakes fall in, a brief explanation of that sub topic and 2-3 tips on how to improve.'
          },
          {
            role: 'user',
            content: `Based on the following incorrect answers from a quiz, provide a concise revision guide telling the user which areas to focus on. Send your response as a JSON with three properties: subTopic, message, and strategies. The subTopic will be a one to five word name of the topic the user is getting wrong, the message will be an explanation of the concept, and strategies will be an array of 2-3 strategies to improve:
${wrongAnswers.map(answer =>
`Question: ${answer.question}
User's incorrect answer: ${answer.user_response}
Correct answer: ${answer.correct_response}`
).join('\n\n')}
Format your response as a JSON object.`
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
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error in OpenAI API request:', error.response ? error.response.data : error.message);
    return { error: 'Failed to generate revision', details: error.message };
  }
}

module.exports = { generateRevision };