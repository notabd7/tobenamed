import React from 'react';
import './LandingPage.css';  // Importing the CSS styles

const LandingPage = () => {

    // Function to trigger the hidden file input
    const handleClick = () => {
        document.getElementById('file-input').click();
    }

    // Handling file drop or file select
    const handleFiles = (files) => {
        alert(`You uploaded ${files.length} file(s)`);
        console.log('Files:', files);
    }

    // Handle drag over and drop events
    const handleDragOver = (e) => {
        e.preventDefault();
        document.body.classList.add('dragover');
    };

    const handleDragLeave = () => {
        document.body.classList.remove('dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        document.body.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="container" 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
            {/* Explainer Text */}
            <h1>Need help studying?</h1>
            <p className="subtext">Upload your notes, presentations, textbooks, and study materials to instantly generate flashcards and quizzes.</p>

            {/* Upload Section */}
            <div className="upload-area" id="upload-area">
                <button className="upload-btn" onClick={handleClick}>Select your study materials!</button>
                <p>or drop files here</p>
                <input type="file" id="file-input" multiple style={{display: 'none'}} onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {/* Privacy Note */}
            <p className="privacy-note">Your files are secure and private. We don't share your study materials.</p>
        </div>
    );
}

export default LandingPage;
