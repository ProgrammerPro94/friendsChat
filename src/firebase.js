import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDhvzQg6XzWmnP0XuDNQGLUrd_90v8CBRU",
    authDomain: "messenger-clone-2faaf.firebaseapp.com",
    databaseURL: "https://messenger-clone-2faaf.firebaseio.com",
    projectId: "messenger-clone-2faaf",
    storageBucket: "messenger-clone-2faaf.appspot.com",
    messagingSenderId: "521684597482",
    appId: "1:521684597482:web:99a896a6e3fdcf1bf13593",
    measurementId: "G-M6H5DDWCCS"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export default db;
