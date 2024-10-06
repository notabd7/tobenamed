import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const processFile = useCallback(
    debounce(async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);
      navigate('/overview', { state: { isLoading: true } });

      try {
        const [quizResponse, summaryResponse, flashCardResponse] = await Promise.all([
          axios.post('http://localhost:3000/generate-quiz', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }),
          axios.post('http://localhost:3000/summarize', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }),
          axios.post('http://localhost:3000/flashcards', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }),
        ]);

        console.log('Quiz generation response:', quizResponse.data);
        console.log('Summary response:', summaryResponse.data);
        console.log('Flash Card response:', flashCardResponse.data.flashCards);

        navigate('/overview', { 
          state: { 
            quizData: quizResponse.data.quiz,
            summaryData: summaryResponse.data.summary,
            flashCardData: flashCardResponse.data.flashCards, // Note the capital 'C' in flashCards
            isLoading: false
          } 
        });
      } catch (error) {
        console.error('Error processing file:', error);
        navigate('/overview', { 
          state: { 
            error: 'An error occurred while processing the file. Please try again.',
            isLoading: false
          } 
        });
      }
    }, 300),
    [navigate]
  );

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const handleUploadClick = () => {
    if (file) {
      processFile(file);
    } else {
      document.getElementById('file-input').click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    processFile(droppedFile);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div
        className="max-w-2xl w-full space-y-8 text-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h1 className="text-4xl font-bold text-gray-900">Need help studying?</h1>
        <p className="text-xl text-gray-600">
          Upload your notes, presentations, textbooks, and study materials to instantly generate flashcards and quizzes.
        </p>
        <div className="mt-8">
          <button
            onClick={handleUploadClick}
            className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : file ? 'Upload selected file' : 'Select your study materials!'}
          </button>
          <p className="mt-2 text-sm text-gray-500">or drop files here</p>
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-sm text-gray-500 mt-8">
          Your files are secure and private. We dont share your study materials.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;