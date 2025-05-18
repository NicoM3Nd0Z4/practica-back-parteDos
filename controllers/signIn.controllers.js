import crypto from "crypto";

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":"); // Extraemos la sal y el hash
  const newHash = crypto.createHash("sha512").update(salt + password).digest("base64url");
  return newHash === hash;
}

export const signIn = async (req, res) => {
  try {
      const { username, password } = req.body;

      // Buscar usuario en la base de datos
      const user = await User?.findOne({ username });

      if (!user) {
          return res.status(400).json({ isLogin: false, message: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      const isLogin = verifyPassword(password, user.password);

      if (isLogin) {
          res.status(200).json({ isLogin: true, user });
      } else {
          res.status(400).json({ isLogin: false, message: "Contraseña incorrecta" });
      }
  } catch (error) {
      console.error("Error en el login:", error);
      res.status(500).json({ isLogin: false, message: "Error en el servidor" });
  }
};
