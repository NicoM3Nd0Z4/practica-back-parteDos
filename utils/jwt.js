import { Router } from 'express';

export const validateJWT = Router();

validateJWT.use((req, rest, next) => {
  let token = req.headers.authorization;
  if (!token) {
    rest.status(401).json({ msg: "se requiere token" });
    return;
  }
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  jwt.verify(token, process.env.JWT, (e, decoded) => {
    if (e) {
      rest.status(401).json({ msg: "token no valido" });
    } else {
      req.user = decoded;
      next();
    }
  })
})