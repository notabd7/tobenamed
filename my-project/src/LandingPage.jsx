import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';
import fileIcon from '/icon.png'; // Import the icon

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const processFiles = useCallback(
    debounce(async (files) => {
      if (files.length === 0) return;

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append('file', files[0]); // Only send the first file

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

        const processedData = {
          quizData: quizResponse.data.quiz,
          summaryData: summaryResponse.data.summary,
          flashCardData: flashCardResponse.data.flashCards,
        };

        setIsLoading(false);
        navigate('/overview', { state: { ...processedData, isLoading: false } });
      } catch (error) {
        console.error('Error processing files:', error);
        setIsLoading(false);
        // You might want to set an error state here and display it to the user
      }
    }, 300),
    [navigate]
  );

  const getFileIcon = () => fileIcon;

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
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleStudyClick = () => {
    if (uploadedFiles.length > 0) {
      processFiles(uploadedFiles);
    } else {
      console.error('No files uploaded');
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
      className={`min-h-screen flex flex-col items-center justify-between p-8 ${isDragging ? 'bg-gray-200' : 'bg-gray-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-between space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">Need help studying?</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Upload your notes, presentations, textbooks, and more to instantly generate flashcards and quizzes.
          </p>
        </div>

        <div className="w-full max-w-md flex flex-col items-center">
          <label htmlFor="file-upload" className="w-full">
            <div className="bg-orange-500 text-white text-3xl font-semibold py-6 px-12 rounded-full text-center cursor-pointer hover:bg-orange-600 transition-colors">
              {isLoading ? 'Processing...' : 'Select your study materials!'}
            </div>
          </label>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileInputChange}
            multiple
          />
          <p className="text-center mt-2 text-gray-500">or drop files here</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className={`w-full max-w-md p-4 rounded-lg ${isDragging ? 'bg-gray-200' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-2 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <img src={getFileIcon(file)} alt="File icon" className="w-[100px] h-[100px] object-contain" />
                  <span className="text-sm text-center">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && !isLoading && (
          <button
            onClick={handleStudyClick}
            className="bg-orange-500 text-white text-3xl font-semibold py-6 px-12 rounded-full hover:bg-orange-600 transition-colors"
          >
            Let's study!
          </button>
        )}

        {isLoading && (
          <div className="text-xl font-semibold text-gray-600">
            Processing your files...
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-end mt-8">
        <div></div>
        <p className="text-sm text-gray-500 ml-60">
          Your files are secure and private. We don't share your study materials.
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