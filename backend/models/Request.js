const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
