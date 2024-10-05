// Grab the body and file input
const body = document.querySelector('body');
const fileInput = document.getElementById('file-input');

// Add event listeners for drag-and-drop functionality on the entire body
body.addEventListener('dragover', (e) => {
    e.preventDefault();  // Prevent the default browser behavior
    body.classList.add('dragover');  // Add a class to change background color
});

body.addEventListener('dragleave', () => {
    body.classList.remove('dragover');  // Remove the class when the user stops dragging
});

body.addEventListener('drop', (e) => {
    e.preventDefault();  // Prevent the file from opening in the browser
    body.classList.remove('dragover');  // Remove the dragover class

    // Access the dropped files
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// Trigger the file input when clicking on the "Select Files" button
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        // Process the files (you can upload them to the server or do something else)
        console.log('Files uploaded:', files);
        alert(`You uploaded ${files.length} file(s)`);
    }
}
