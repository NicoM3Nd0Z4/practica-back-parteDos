
// const express = require('express');
import "dotenv/config";
import express from 'express';
import cors from "cors";
import indexRoutes from './routes/index.routes.js';
// import itemsRoutes from './routes/items.routes.js';
import loginRoutes from './routes/login.routes.js';
import morgan from "morgan";
import crypto from "crypto";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Rutas
app.use(indexRoutes);
// app.use(itemsRoutes);
// app.use(itemsRoutes2);
// app.use(itemsRoutes3);
app.use(loginRoutes);

//hashing test
let msg = "Hello, world!";
const hashing = crypto.createHash("sha512");
const hash = hashing.update(msg).digest("base64url");
console.log(hash);

//Hashing Pepper
const pepper = process.env.PEPPER;

const newMsg = pepper + msg;
const hashing2 = crypto.createHash("sha512");

const hashpepper = hashing2.update(newMsg).digest("base64url");
console.log(hashpepper);

//Hashing Salt
const salt = crypto.randomBytes(24);

const newMsg2 = salt.toString(("base64url")) + msg;
const hashing3 = crypto.createHash("sha512");

const hashSalt = hashing3.update(newMsg2).digest("base64url");
console.log(salt + ":" + hashSalt);

//Cifrando el hash
const texto = "Hola mundo!";

const encryption_key = "byz9VFNtbRQM0yBODcCb1lrUtVVH3D3x"; // 32 chars
const initialization_vector = "X05IGQ5qdBnIqAWD"; // 16 chars

const cipher = crypto.createCipheriv(
  "aes-256-cbc",
  Buffer.from(encryption_key),
  Buffer.from(initialization_vector)
);

let crypted = cipher.update(texto,"utf8", "hex");
crypted += cipher.final("hex");
console.log(crypted);

// Desencriptando el hash
const decipher = crypto.createDecipheriv(
  "aes-256-cbc",
  Buffer.from(encryption_key),
  Buffer.from(initialization_vector)
);
let dec = decipher.update(crypted, "hex", "utf8");
dec += decipher.final("utf8");
console.log(dec);

app.listen(5000, console.log("http://localhost:5000"));

console.log('Hello, world!');