const express = require('express');
const cors = require('cors');
const { getChatGPTSummary, } = require('../bulletPoints');
const { createQuizFromFile } = require('../quiz');
const multer = require('multer');
const path = require('path');

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
    const summary = await getChatGPTSummary(req.file.path);
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
    const quiz = await createQuizFromFile(req.file.path);
    res.json({ quiz });
  } catch (error) {
    console.error('Error in generate-quiz endpoint:', error);
    res.status(500).send('An error occurred while generating the quiz.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});