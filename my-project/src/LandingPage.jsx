import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        document.getElementById('file-input').click();
    }

    const handleFiles = (files) => {
        alert(`You uploaded ${files.length} file(s)`);
        console.log('Files:', files);
        // Navigate to the overview page after file upload
        navigate('/overview', { state: { filesUploaded: files.length } });
    }

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
        handleFiles(e.dataTransfer.files);
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
                        onClick={handleClick}
                        className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md"
                    >
                        Select your study materials!
                    </button>
                    <p className="mt-2 text-sm text-gray-500">or drop files here</p>
                    <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                        multiple
                    />
                </div>
                <p className="text-sm text-gray-500 mt-8">
                    Your files are secure and private. We don't share your study materials.
                </p>
            </div>
        </div>
    );
}

export default LandingPage;