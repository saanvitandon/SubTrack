const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

// ➕ ADD subscription
router.post("/", async (req, res) => {
  try {
    const { userEmail, name, cost, cycle, category } = req.body;

    if (!userEmail || !name || !cost || !cycle || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSub = new Subscription({
      userEmail,
      name,
      cost,
      cycle,
      category
    });

    await newSub.save();

    res.status(201).json(newSub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ DELETE subscription
router.delete("/:id", async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

router.put("/:id", async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const subs = await Subscription.find({
      userEmail: req.params.email
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});