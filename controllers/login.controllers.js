import {sqlConnect, sql} from "../utils/sql.js";

export const login = async(req, res) => {
  const user = await db.collection("users").doc(req.body.username).get();
  // const pool = await sqlConnect();
  // const data = await pool
  //   .request()
  //   .input("username", sql.VarChar, req.body.username)
  //   .query("select * from users where username = @username");
  // console.log(data.recordset);
  if (!user.exists) {
    return res.json({ isLogin: false, user: {} });
  }
  const salt = user.data().password.substring(0, process.env.SALT_LENGTH);
  const hash = hashPassword(req.body.password, salt);
  const saltedHash = salt + hash;
  let isLogin = user.data().recordset[0].password === saltedHash;
  if(isLogin) {
    const token = jwt.sign({ sub: user.data().id }, process.env.JWT, { 
      expiresIn: "1h" 
    });
    res
      .status(200)
      .json({ isLogin: isLogin, user: user.data().recordset[0], token: token });
  } else {
    res.status(400).json({ isLogin: isLogin, user: {} });
  }
};