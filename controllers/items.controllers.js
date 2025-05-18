import {sqlConnect, sql} from "../utils/sql.js";

export const getItems = async(req, res) => {
  const pool = await sqlConnect();
  const data = await pool.request().query("SELECT * FROM items");
  res.json(data.recordset);
};

export const getItem = async(req, res) => {
  const pool = await sqlConnect();
  const data = await pool
    .request()
    .input("myID", sql.Int, req.params.id)
    .query("SELECT * FROM items WHERE id = @myID");
  res.json(data.recordset);
};

export const postItem = async(req, res) => {
  const pool = await sqlConnect();
  await pool
    .request()
    .input("name", sql.VarChar, req.body.name)
    .input("price", sql.Int, req.body.price)
    .query("INSERT INTO items (name, price) VALUES (@name, @price)");
  const data = await pool.request()
  .input("name", sql.VarChar, req.body.name)
  .input("price", sql.Int, req.body.price)
  .query("insert into items (name, price) values (@name, @price)");
  res.status(200).json({ operation: true, item: data.recordset[0] });
};

export const putItem = async(req, res) => {
  const pool = await sqlConnect();
  const data = await pool.request()
  .input("myID", sql.Int, req.params.id)
  .input("name", sql.VarChar, req.params.name)
  .input("price", sql.Int, req.params.price)
  .query("UPDATE items SET name = @name, price = @price WHERE id = @myID");
  res.status(200).json({ operation: true });
};

export const deleteItem = async(req, res) => {
  const pool = await sqlConnect();
  const data = await pool.request()
  .input("myID", sql.Int, req.params.id)
  .query("DELETE FROM items WHERE id = @id");
  res.status(200).json({ operation: true });
};