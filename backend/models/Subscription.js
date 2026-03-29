const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  cycle: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);