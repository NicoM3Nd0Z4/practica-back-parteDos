import db from "../utils/firebase.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":"); // Extraemos la sal y el hash
  const newHash = crypto.createHash("sha512").update(salt + password).digest("base64url");
  return newHash === hash;
}

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        isLogin: false, 
        message: "Username and password are required" 
      });
    }

    // Get user from Firebase
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("username", "==", username).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ 
        isLogin: false, 
        message: "Invalid credentials" 
      });
    }

    // Get user data
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isLogin = verifyPassword(password, userData.password);

    if (isLogin) {
      // Generate JWT token
      const token = jwt.sign(
        { sub: userDoc.id, username: userData.username }, 
        process.env.JWT, 
        { expiresIn: "1h" }
      );
      
      return res.status(200).json({ 
        isLogin: true, 
        user: {
          id: userDoc.id,
          username: userData.username,
          // Add other user fields as needed, but exclude password
        },
        token: token
      });
    } else {
      return res.status(401).json({ 
        isLogin: false, 
        message: "Invalid credentials" 
      });
    }
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ isLogin: false, message: "Error en el servidor" });
  }
};
