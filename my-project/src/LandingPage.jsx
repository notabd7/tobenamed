import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const navigate = useNavigate();

  const processFile = useCallback(
    debounce(async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);

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

        setProcessedData({
          quizData: quizResponse.data.quiz,
          summaryData: summaryResponse.data.summary,
          flashCardData: flashCardResponse.data.flashCards,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing file:', error);
        setIsLoading(false);
        // You might want to set an error state here and display it to the user
      }
    }, 300),
    [navigate]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setUploadedFiles(files);
    console.log('Files uploaded:', files);
    if (files.length > 0) {
      setFile(files[0]);
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const goToStudyPage = () => {
    if (processedData) {
      navigate('/overview', { 
        state: { 
          ...processedData,
          isLoading: false
        } 
      });
    } else {
      console.error('No processed data available');
      // You might want to show an error message to the user here
    }
  };

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signin');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-8 bg-gray-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-800 text-center">Need help studying?</h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          Upload your notes, presentations, textbooks, and more to instantly generate flashcards and quizzes.
        </p>
        <div className="w-full max-w-md">
          <label htmlFor="file-upload" className="w-full">
            <div className="bg-orange-500 text-white text-2xl font-semibold py-4 px-8 rounded-lg text-center cursor-pointer hover:bg-orange-600 transition-colors">
              {isLoading ? 'Processing...' : file ? 'Upload selected file' : 'Select your study materials!'}
            </div>
          </label>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileInputChange}
          />
          <p className="text-center mt-2 text-gray-500">or drop files here</p>
        </div>
        {processedData && !isLoading && (
          <button
            onClick={goToStudyPage}
            className="bg-green-500 text-white text-xl font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            Let's study!
          </button>
        )}
      </div>
      <div className="w-full flex justify-between items-end">
        <p className="text-sm text-gray-500">
          Your files are secure and private. We dont share your study materials.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-700 mb-2">Want to save your progress?</p>
          <div className="flex space-x-2">
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={handleLogin}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;