import firebase from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const app = firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
    clientEmail: process.env.CLIENT_EMAIL,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  }),
});


// Initialize Firebase
const db = getFirestore(app);

export default db;