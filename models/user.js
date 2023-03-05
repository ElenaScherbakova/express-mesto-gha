const mongoose = require("mongoose")
const { field, link } = require("./types")

const userSchema = new mongoose.Schema({
  name: field,
  about: field,
  avatar: link,
})

module.exports = userSchema
