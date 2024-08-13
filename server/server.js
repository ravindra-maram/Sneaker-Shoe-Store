// require("dotenv").config();
require("dotenv").config({ path: "./server/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dataRoutes = require("./routes/dataRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { loadInitialData } = require("./controllers/dataController");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://rmaram0823:Bablu$142@cluster0.f7gmzzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB...!");
    loadInitialData(); // Load products on server start
  })
  .catch((err) => console.log(err));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
