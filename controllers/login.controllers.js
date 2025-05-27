import db from "../utils/firebase.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const login = async(req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ 
        isLogin: false, 
        message: "Username and password are required" 
      });
    }

    // Get user from Firebase
    const user = await db.collection("users").doc(req.body.username).get();
    
    if (!user.exists) {
      return res.status(401).json({ 
        isLogin: false, 
        message: "Invalid credentials" 
      });
    }

    // Get user data
    const userData = user.data();
    
    // DEBUGGING - Log what we have (remove in production)
    console.log("Stored password:", userData.password);
    console.log("Input password:", req.body.password);
    
    // Check password format - properly split salt and hash
    if (userData.password.includes(":")) {
      // Password is stored as "salt:hash"
      const [salt, storedHash] = userData.password.split(":");
      
      // Use the same hash function as in your registration
      const hash = crypto.createHash("sha512")
        .update(salt + req.body.password)
        .digest("base64url");
      
      const isLogin = (hash === storedHash);
      
      if(isLogin) {
        // Generate JWT token
        const token = jwt.sign(
          { username: req.body.username },
          process.env.JWT,
          { expiresIn: "1h" }
        );
        
        return res.status(200).json({ 
          isLogin: true,
          user: {
            username: req.body.username
          },
          token: token
        });
      }
    }
    
    // If we got here, authentication failed
    return res.status(401).json({ 
      isLogin: false, 
      message: "Invalid credentials" 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      isLogin: false, 
      message: "Error during authentication" 
    });
  }
};