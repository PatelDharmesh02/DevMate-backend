const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/users.js");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = req.body;
  const newUser = new User(user);
  try {
    await newUser.save();
    res.json({ message: "User added successfully" });
  } catch (error) {
    res.status(404).send("User already exists with given email Id!!")
  }
});

app.get("/feed", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    // If no users found, return a 404 status with a message
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found!" });
    }
    // Return the list of users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Get user by ID
app.get("/user/:id", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    // If user not found, return a 404 status with a message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the user data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Update user by ID (PUT) using replaceOne
app.put("/user/:id", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Ensure the _id is preserved
    const replacement = { ...req.body, _id: req.params.id };
    const result = await User.replaceOne({ _id: req.params.id }, replacement, { runValidators: true });
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "User not updated" });
    }
    // Fetch the updated user
    const updatedUser = await User.findById(req.params.id);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Patch user by ID (PATCH)
app.patch("/user/:id", async (req, res) => {
  try {
    // Check if user exists
    const patchedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    // If user not found, return a 404 status with a message
    if (!patchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the patched user data
    res.json({ message: "User patched successfully", user: patchedUser });
  } catch (error) {
    res.status(500).json({ message: "Error patching user", error: error.message });
  }
});

// Delete user by ID
app.delete("/user/:id", async (req, res) => {
  try {
    // Check if user exists and delete
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    // If user not found, return a 404 status with a message
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return a success message
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

connectDB().then(() => {
  console.log("Database connected");
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
