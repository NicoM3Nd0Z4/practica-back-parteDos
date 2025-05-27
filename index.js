
import "dotenv/config";
import express from 'express';
import cors from "cors";
import morgan from "morgan";
import db from './utils/firebase.js';
import crypto from "crypto";

// Routes
import indexRoutes from './routes/index.routes.js';
import itemsRoutes from './routes/items.routes.js';
import loginRoutes from './routes/login.routes.js';
import signInRoutes from './routes/signIn.routes.js';
import usersRoutes from './routes/users.routes.js';


const app = express();

// Add at the top of your file
console.log("Starting application...");
console.log("Environment variables present:", {
  projectId: !!process.env.PROJECT_ID,
  privateKey: !!process.env.PRIVATE_KEY,
  clientEmail: !!process.env.CLIENT_EMAIL
});

// At the end before listen
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Rutas
app.use(indexRoutes);
app.use(itemsRoutes);
app.use(loginRoutes);
app.use(signInRoutes); 
app.use(usersRoutes);
// Add this to your routes
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});
app.get('/firebase-test', async (req, res) => {
  try {
    // Simple Firebase query
    const snapshot = await db.collection('test').get();
    return res.status(200).json({ 
      message: 'Firebase connection successful',
      collections: snapshot.size 
    });
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ 
      message: 'Firebase connection failed', 
      error: error.message 
    });
  }
});

// //hashing test
// let msg = "Hello, world!";
// const hashing = crypto.createHash("sha512");
// const hash = hashing.update(msg).digest("base64url");
// console.log(hash);

// //Hashing Pepper
// const pepper = process.env.PEPPER;

// const newMsg = pepper + msg;
// const hashing2 = crypto.createHash("sha512");

// const hashpepper = hashing2.update(newMsg).digest("base64url");
// console.log(hashpepper);

// //Hashing Salt
// const salt = crypto.randomBytes(24);

// const newMsg2 = salt.toString(("base64url")) + msg;
// const hashing3 = crypto.createHash("sha512");

// const hashSalt = hashing3.update(newMsg2).digest("base64url");
// console.log(salt + ":" + hashSalt);

// //Cifrando el hash
// const texto = "Hola mundo!";

// const encryption_key = "byz9VFNtbRQM0yBODcCb1lrUtVVH3D3x"; // 32 chars
// const initialization_vector = "X05IGQ5qdBnIqAWD"; // 16 chars

// const cipher = crypto.createCipheriv(
//   "aes-256-cbc",
//   Buffer.from(encryption_key),
//   Buffer.from(initialization_vector)
// );

// let crypted = cipher.update(texto,"utf8", "hex");
// crypted += cipher.final("hex");
// console.log(crypted);

// // Desencriptando el hash
// const decipher = crypto.createDecipheriv(
//   "aes-256-cbc",
//   Buffer.from(encryption_key),
//   Buffer.from(initialization_vector)
// );
// let dec = decipher.update(crypted, "hex", "utf8");
// dec += decipher.final("utf8");
// console.log(dec);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

console.log('Hello, world!');