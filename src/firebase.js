import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCDLaew37hTTp-S-QFXlpC1ool7ECkrGuM",
  authDomain: "karmic-597af.firebaseapp.com",
  projectId: "karmic-597af",
  storageBucket: "karmic-597af.appspot.com",
  messagingSenderId: "1025594453070",
  appId: "1:1025594453070:web:8bfef61eab48510688a71f",
  measurementId: "G-QEYBSBEGGJ"
};
  const firebaseApp = firebase.initializeApp(firebaseConfig);


  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth};