const mongoose = require("mongoose");

const field = {
  type: String,
  maxLength: 30,
  minLength: 2,
  default: "",
}

const link = {
  type: String,
  default: "",
  validate: {
    // Валидатор поддерживает URL с любым известным протоколом, в том числе и с data:
    validator: (value) => {
      try {
        // eslint-disable-next-line no-new
        new URL(value)
        return true
      } catch (e) {
        return false
      }
    },
    message: "Значение не является URL",
  },
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
