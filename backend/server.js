const express = require('express');
const cors = require('cors');
const { getChatGPTSummary } = require('./bulletPoints');
const { generateQuiz } = require ('./quiz')
const { extractTextFromFile } = require ('./textExtraction')
const multer = require('multer');
const path = require('path');
const supabase = require('../supaBaseClient'); // Import your Supabase client

const app = express();
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
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Endpoints
app.post('/summarize', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const content = await extractTextFromFile(req.file.path)
    const summary = await getChatGPTSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    res.status(500).send('An error occurred while summarizing the file.');
  }
});

app.post('/generate-quiz', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    try {
        const content = await extractTextFromFile(req.file.path)
        const summary = await getChatGPTSummary(content);
        const quizResult = await generateQuiz(content, summary);
      
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

  // New route to test Supabase connection
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