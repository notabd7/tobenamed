import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

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

  const goToStudyPage = () => {
    navigate('/dashboard', { state: { files: uploadedFiles } });
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
              Select your study materials!
            </div>
          </label>
          <input 
            id="file-upload" 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileInputChange}
          />
          <p className="text-center mt-2 text-gray-500">or drop files here</p>
        </div>
        {uploadedFiles.length > 0 && (
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