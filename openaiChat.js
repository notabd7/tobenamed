const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse'); // For parsing PDFs

const apiKey = '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';

async function getChatGPTSummary(textContent) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',  // Use the preferred model
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that summarizes text.'
                    },
                    {
                        role: 'user',
                        content: `Return me a summary in the form of bullet points of the first 10 pages: ${textContent}`
                    }
                ],
                max_tokens: 200, // Adjust for summary length
                temperature: 0.5, // Set low for a more concise and focused summary
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        // Print only the summary
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error in OpenAI API request:', error.response ? error.response.data : error.message);
    }
}

// Function to read a text file or a PDF and summarize it
async function summarizeFile(filePath) {
    // Check if it's a PDF or a text file
    if (filePath.endsWith('.pdf')) {
        // If it's a PDF, read and extract text using pdf-parse
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const textContent = data.text;

        // Summarize the extracted text
        return getChatGPTSummary(textContent);
    } else if (filePath.endsWith('.txt')) {
        // If it's a text file, read the file content
        const textContent = fs.readFileSync(filePath, 'utf-8');
        
        // Summarize the text
        return getChatGPTSummary(textContent);
    } else {
        console.error('Unsupported file format. Please use a .pdf or .txt file.');
    }
}

// Example usage: summarize a file (replace with your actual file path)
const filePath = 'book.pdf'; // Replace with path to your .txt or .pdf file
summarizeFile(filePath);