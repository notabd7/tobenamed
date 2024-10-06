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
        files.forEach((file) => {
          formData.append(`files`, file);
        });

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
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
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

  const removeFile = (index) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  
  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-between p-8 ${isDragging ? 'bg-orange-100' : 'bg-gray-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center">
        <div className="text-center mt-16 mb-16">
          <h1 className="text-7xl font-bold text-gray-800 mb-6">Need help studying?</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Upload your notes, presentations, textbooks, and more to instantly generate flashcards and quizzes.
          </p>
        </div>

        <div className="w-full max-w-md flex flex-col items-center space-y-8 mb-auto">
          {!isLoading && (
            <div className="w-full flex flex-col items-center">
              <label htmlFor="file-upload" className="w-full">
                <div className="bg-custom-orange-500 text-white text-3xl font-semibold py-6 px-12 rounded-full text-center cursor-pointer hover:bg-custom-red-500 transition-colors">
                  Select your study materials!
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
          )}

          {uploadedFiles.length > 0 && (
            <div className="w-full max-w-md flex justify-center">
              <div className={`p-4 rounded-lg ${isDragging ? 'bg-orange-100' : 'bg-gray-50'}`}>
                <div className="flex flex-wrap justify-center gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 relative">
                      <img src={getFileIcon(file)} alt="File icon" className="w-[100px] h-[100px] object-contain" />
                      <span className="text-sm text-center w-24 truncate">{file.name}</span>
                      {!isLoading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && !isLoading ? (
            <button
              onClick={handleStudyClick}
              className="bg-orange-500 text-white text-3xl font-semibold py-6 px-12 rounded-full hover:bg-orange-600 transition-colors"
            >
              Let's study!
            </button>
          ) : isLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <p className="text-sm text-gray-500">
          Your files are secure and private. We don't share your study materials.
        </p>
      </div>

      <style jsx>{`
        .loader-container {
          position: absolute;
          left: 50%;
          top: calc(40% + 25vh);
          transform: translate(-50%, -50%);
        }
        .loader {
          width: 60px;
          height: 30px;
          --c: no-repeat radial-gradient(farthest-side,#000 93%,#0000);
          background:
            var(--c) 0    0,
            var(--c) 50%  0;
          background-size: 12px 12px;
          position: relative;
          clip-path: inset(-200% -100% 0 0);
          animation: l6-0 1.5s linear infinite;
        }
        .loader:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 18px;
          background: #000;
          left: -24px;
          top: 0;
          animation: 
            l6-1 1.5s linear infinite,
            l6-2 0.5s cubic-bezier(0,200,.8,200) infinite;
        }
        .loader:after {
          content: "";
          position: absolute;
          inset: 0 0 auto auto;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #000; 
          animation: l6-3 1.5s linear infinite;
        }
        @keyframes l6-0 {
          0%,30%  {background-position: 0  0   ,50% 0   }
          33%     {background-position: 0  100%,50% 0   }
          41%,63% {background-position: 0  0   ,50% 0   }
          66%     {background-position: 0  0   ,50% 100%}
          74%,100%{background-position: 0  0   ,50% 0   }
        }
        @keyframes l6-1 {
          90%  {transform:translateY(0)}
          95%  {transform:translateY(22.5px)}
          100% {transform:translateY(22.5px);left:calc(100% - 12px)}
        }
        @keyframes l6-2 {
          100% {top:-0.1px}
        }
        @keyframes l6-3 {
          0%,80%,100% {transform:translate(0)}
          90%         {transform:translate(39px)}
        }
      `}</style>
    </div>
  );
};

export default LandingPage;