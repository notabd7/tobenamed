const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { getChatGPTFlashCards } = require('./bulletPoints');
const { getChatGPTSummary } = require('./summary');
const { generateQuiz } = require('./quiz');
const { extractTextFromFile } = require('./textExtraction');
const { generateRevision } = require('./revision');
const multer = require('multer');
const path = require('path');
const supabase = require('../config/supaBaseClient');

const app = express();
const SERP_API_KEY = process.env.SERP_API_KEY;
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware to extract text from multiple files
const extractTextFromFiles = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  try {
    const textPromises = req.files.map(file => extractTextFromFile(file.path));
    const extractedTexts = await Promise.all(textPromises);
    req.extractedText = extractedTexts.join('\n\n');
    next();
  } catch (error) {
    console.error('Error in extracting text:', error);
    res.status(500).send('An error occurred while extracting text');
  }
};

// Endpoints
app.post('/summarize', upload.array('files'), extractTextFromFiles, async (req, res) => {
  try {
    const summary = await getChatGPTSummary(req.extractedText);
    res.json({ summary });
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    res.status(500).send('An error occurred while summarizing the files.');
  }
});

app.post('/flashcards', upload.array('files'), extractTextFromFiles, async (req, res) => {
  try {
    const flashCards = await getChatGPTFlashCards(req.extractedText);
    if (flashCards.error) {
      console.error('Error generating flashcards:', flashCards.error);
      res.status(500).json({ error: flashCards.error, details: flashCards.details || flashCards.rawContent });
    } else {
      res.json({ flashCards });
    }
  } catch (error) {
    console.error('Error in flashcards endpoint:', error);
    res.status(500).send('An error occurred while generating the flashcards.');
  }
});

app.post('/generate-quiz', upload.array('files'), extractTextFromFiles, async (req, res) => {
  try {
    const summary = await getChatGPTSummary(req.extractedText);
    const quizResult = await generateQuiz(req.extractedText, summary);
    if (quizResult.error) {
      console.error('Error generating quiz:', quizResult.error);
      res.status(500).json({ error: quizResult.error, details: quizResult.details || quizResult.rawContent });
    } else {
      res.json({ quiz: quizResult });
    }
  } catch (error) {
    console.error('Error in generate-quiz endpoint:', error);
    res.status(500).send('An error occurred while generating the quiz.');
  }
});

app.post('/revision', async (req, res) => {
  try {
    const { wrongAnswers } = req.body;
    const revisionData = await generateRevision(wrongAnswers);
    res.json(revisionData);
  } catch (error) {
    console.error('Error in revision endpoint:', error);
    res.status(500).json({ error: 'An error occurred while generating the revision guide.' });
  }
});

app.get('/api/resources', async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'No topic provided' });
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: `${topic} tutorial OR guide OR explanation`,
        api_key: SERP_API_KEY,
        num: 5
      }
    });

    if (!response.data || !response.data.organic_results) {
      return res.status(500).json({ error: 'Unexpected response structure from SERP API' });
    }

    const resources = response.data.organic_results.map(result => ({
      title: result.title || 'No title',
      url: result.link || '#',
      snippet: result.snippet || 'No description available'
    }));

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Route to test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('notesapp').select('*').limit(1);
    if (error) throw error;
    res.json({ success: true, message: 'Supabase connection successful', data });
  } catch (error) {
    console.error('Supabase connection error:', error);
    res.status(500).json({ success: false, message: 'Supabase connection failed', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});