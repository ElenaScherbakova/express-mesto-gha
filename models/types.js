const mongoose = require("mongoose");

const field = {
  type: String,
  required: true,
  maxLength: 30,
  minLength: 2,
}

const link = {
  type: String,
  required: true,
}

const id = {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
}

module.exports = {
  field,
  link,
  id,
}
