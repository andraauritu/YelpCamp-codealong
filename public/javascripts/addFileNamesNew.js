
function previewMultiple(event) {
    const images = document.getElementById("image");
    const number = images.files.length;
    const formFileElement = document.getElementById("formFile");

    // Clear the existing content of formFileElement
    formFileElement.innerHTML = '';

    for (i = 0; i < number; i++) {
        const file = event.target.files[i];
        const urls = URL.createObjectURL(file);

        // Create a new div to hold the image and file name
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-preview');
        imageDiv.innerHTML = `
            <img src="${urls}">
            <p>${file.name}</p>
        `;

        formFileElement.appendChild(imageDiv);
    }
}
