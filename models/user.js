const { Schema, model } = require("mongoose")
const { field, link } = require("./types")

const userSchema = new Schema({
  name: field,
  about: field,
  avatar: link,
})

module.exports = model("user", userSchema)
