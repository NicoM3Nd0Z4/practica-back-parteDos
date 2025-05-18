

export const postUser = async (req, res) => {
  const {name, username, password} = req.body;
  const salt = getSalt();
  const hash = hashPassword(password, salt);
  const hashed = salt + hash;
  await db.collection("users").doc(username).set({name, username, password: hashed});
  res.status(200).json({ operation: true, user: {name, username, password: hashed} });
}