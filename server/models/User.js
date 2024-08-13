const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  purchaseHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  shippingAddress: { type: String },
});

module.exports = mongoose.model("User", userSchema);
