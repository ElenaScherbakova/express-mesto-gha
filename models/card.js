const { Schema, model } = require("mongoose")
const { field, link, id } = require("./types");

const cardSchema = new Schema({
  name: field,
  link,
  owner: id,
  likes: {
    type: Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model("card", cardSchema)
