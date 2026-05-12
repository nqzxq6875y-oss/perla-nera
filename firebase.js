const firebaseConfig = {
    apiKey: "AIzaSyD-KvXZv60I4-3TF0PHW4rNpQue97lnUi0",
    authDomain: "perla-nera-799f4.firebaseapp.com",
    projectId: "perla-nera-799f4",
    storageBucket: "perla-nera-799f4.firebasestorage.app",
    messagingSenderId: "482389692648",
    appId: "1:482389692648:web:2954f432e106fc6207f95d"
};

// Inizializzazione Firebase
firebase.initializeApp(firebaseConfig);

// Moduli usati dal sito
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
