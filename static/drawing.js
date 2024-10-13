const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Start drawing
canvas.addEventListener('mousedown', () => {
    drawing = true;
    ctx.beginPath();
});

// Draw on the canvas
canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;
    ctx.lineWidth = 10; // Brush size
    ctx.lineCap = 'round'; // Rounded ends
    ctx.strokeStyle = 'white'; // Brush color

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.closePath();
});

// Optional: Add touch event support for mobile devices
canvas.addEventListener('touchstart', (event) => {
    drawing = true;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchmove', (event) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
});

canvas.addEventListener('touchend', () => {
    drawing = false;
    ctx.closePath();
});

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Predict number
document.getElementById('predictButton').addEventListener('click', async () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const inputArray = processImageData(imageData); // Process the image data

    // Send to backend
    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: inputArray }),
    });

    const result = await response.json();
    document.getElementById('predictionResult').innerText = `Predicted Number: ${result.prediction}`;
});

// Eraser button event
document.getElementById('eraserButton').addEventListener('click', () => {
    clearCanvas(); // Clear the entire canvas when eraser button is clicked
});

// Process image data to fit your model input
function processImageData(imageData) {
    const data = imageData.data;
    const inputArray = [];

    // Convert image data to 28x28 grayscale
    for (let i = 0; i < data.length; i += 4) {
        const grayscale = data[i]; // Assuming the image is white on black background
        inputArray.push(grayscale / 255); // Normalize the pixel value to [0, 1]
    }

    return inputArray;
}
