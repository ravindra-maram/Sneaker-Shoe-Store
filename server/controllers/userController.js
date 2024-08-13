const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password, firstname, lastname, email, number } = req.body;
  console.log("Registering user:", { username, email, firstname, lastname, number }); // Log the registration details

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({
      username,
      password: hashedPassword, // replace pwd with hashedone
      firstname,
      lastname,
      email,
      number,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error); // Log the error stack trace
    res.status(500).json({ message: "Error registering user", error: error.stack });
  }
};


// Login a user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { email, password, username, purchaseHistory, shippingAddress } =
    req.body;

  const newUser = new User({
    email,
    password,
    username,
    purchaseHistory,
    shippingAddress,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, username, purchaseHistory, shippingAddress } = req.body;

  try {
    const updateUser = {};
    if (email) updateUser.email = email;
    if (username) updateUser.username = username;
    if (purchaseHistory) updateUser.purchaseHistory = purchaseHistory;
    if (shippingAddress) updateUser.shippingAddress = shippingAddress;
    if (password) updateUser.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateUser },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};