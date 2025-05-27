import db from "../utils/firebase.js";
import crypto from "crypto";

// Generate a random salt
const getSalt = () => {
  return crypto.randomBytes(16).toString('base64url');
};

// Hash password with salt
const hashPassword = (password, salt) => {
  return crypto.createHash("sha512").update(salt + password).digest("base64url");
};

export const postUser = async (req, res) => {
  try {
    const {name, username, password} = req.body;
    
    // Validate input
    if (!name || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, username and password are required" 
      });
    }
    
    // Check if user already exists
    const userDoc = await db.collection("users").doc(username).get();
    if (userDoc.exists) {
      return res.status(409).json({ 
        success: false, 
        message: "Username already exists" 
      });
    }
    
    // Hash password
    const salt = getSalt();
    const hash = hashPassword(password, salt);
    const hashedPassword = salt + ":" + hash;
    
    // Save user to database
    await db.collection("users").doc(username).set({
      name, 
      username, 
      password: hashedPassword,
      createdAt: new Date()
    });
    
    // Return success without exposing password
    res.status(201).json({ 
      success: true, 
      user: {
        name, 
        username
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating user" 
    });
  }
};