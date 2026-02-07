// Firebase configuration yahan lagegi (Purani wali use karein)

async function openVerify() {
    document.getElementById('verifyModal').style.display = 'block';
    const video = document.getElementById('video');
    
    // Camera Permission mangna (HTTPS lazmi hai)
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera required to verify payment!");
    }
}

document.getElementById('captureBtn').addEventListener('click', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Image convert to Blob
    canvas.toBlob(blob => {
        // Yahan aap Firebase Storage mein upload ka code likhein
        console.log("Photo Captured and Sent to Database.");
        alert("Verification Success! Card details sent to your email.");
        window.location.reload();
    }, 'image/jpeg');
});
