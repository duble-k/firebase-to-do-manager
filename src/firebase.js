// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_api_key,
    authDomain: "user-management-edbd5.firebaseapp.com",
    projectId: "user-management-edbd5",
    storageBucket: "user-management-edbd5.appspot.com",
    messagingSenderId: process.env.REACT_APP_messaging_id,
    appId: "1:445242643387:web:b85849c1639daf4802ea9e"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { auth, firestore };