import firebase from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

// Simplified initialization
let app;
try {
  app = firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL
    })
  });
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Continue even if Firebase fails, so we can at least see error logs
}

const db = app ? getFirestore(app) : null;

export default db;