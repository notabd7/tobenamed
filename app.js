let uploadedFiles = [];  // Array to store the uploaded files

// Function to handle file upload
function handleFileUpload(files) {
    const fileList = document.getElementById('file-list');
    const studyButton = document.getElementById('study-btn');
    const uploadButton = document.querySelector('.upload-btn');
    const uploadInstructions = document.querySelector('#upload-instructions');

    for (let file of files) {
        uploadedFiles.push(file);
        
        // Create a file item container
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Create a file icon (use a default icon or based on file type)
        const fileIcon = document.createElement('img');
        fileIcon.className = 'file-icon';
        fileIcon.src = getFileIcon(file); // This function will return an icon based on file type

        // Create a text element for the file name
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        // Append the icon and name to the file item
        fileItem.appendChild(fileIcon);
        fileItem.appendChild(fileName);

        // Append the file item to the file list
        fileList.appendChild(fileItem);
    }

    // If files are uploaded, show the "Let's study!" button and hide upload button/text
    if (uploadedFiles.length > 0) {
        studyButton.style.display = 'block';
        uploadButton.style.display = 'none';         // Hide the upload button
        uploadInstructions.style.display = 'none';   // Hide the "or drop files here" text
    }
}

// Function to get the appropriate icon based on the file type
function getFileIcon(file) {
    const fileType = file.type;

    // Check file type and return the correct icon
    if (fileType.includes('pdf')) {
        return 'icons/pdf-icon.png';  // PDF icon path
    } else if (fileType.includes('image')) {
        return 'icons/image-icon.png';  // Image file icon path
    } else if (fileType.includes('word')) {
        return 'icons/word-icon.png';  // Word file icon path
    } else {
        return 'icons/file-icon.png';  // Default file icon path
    }
}


// Function to handle drag and drop functionality on the landing page
function handleDragAndDrop() {
    const body = document.querySelector('body');
    const fileInput = document.getElementById('file-input');

    // Add drag and drop functionality
    body.addEventListener('dragover', (e) => {
        e.preventDefault();  // Prevent default browser behavior
        body.classList.add('dragover');  // Change background during drag
    });

    body.addEventListener('dragleave', () => {
        body.classList.remove('dragover');  // Remove background class on drag leave
    });

    body.addEventListener('drop', (e) => {
        e.preventDefault();  // Prevent default file opening behavior
        body.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files);
    });

    // File select through the input field
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });
}

// Function to transition to the main page when "Let's study!" is clicked
function goToMainPage() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
}

// Function to handle tab switching on the main page
function openTab(event, tabName) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active-content');
    }

    let tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add('active-content');
    event.currentTarget.classList.add("active");
}

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', function () {
    handleDragAndDrop();  // Initialize drag-and-drop functionality on landing page
});
