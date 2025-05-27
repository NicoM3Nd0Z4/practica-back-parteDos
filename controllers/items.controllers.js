import db from "../utils/firebase.js";

export const getItems = async (req, res) => {
  try {
    const items = await db.collection("items").get();
    const list = [];
    items.forEach((doc) =>
      list.push({ id: doc.id, name: doc.data().name, price: doc.data().price })
    );
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await db.collection("items").doc(req.params.id).get();

    if (!item.exists) {
      return res.status(404).json({ error: "Item not found" });
    } 

    res.status(200).json({
      id: req.params.id,
      name: item.data().name,
      price: item.data().price,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving item" });
  }
};

export const postItem = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const item = await db.collection("items").add(req.body);
    res
      .status(201)
      .json({ id: item.id, name: req.body.name, price: req.body.price });
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
};

export const putItem = async (req, res) => {
  try {
    const itemRef = db.collection("items").doc(req.params.id);
    const item = await itemRef.get();

    if (!item.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    await itemRef.update(req.body);
    res.status(200).json({ id: req.params.id, name: req.body.name, price: req.body.price });
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemRef = db.collection("items").doc(req.params.id);
    const item = await itemRef.get();

    if (!item.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    await itemRef.delete();
    res.status(200).json({ msg: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
};