const { definedString } = require("./checks")
const User = require("../models/user")
const { http403, http200, http500 } = require("./http-responses");

const getUser = (req, res) => {
}

const getUsers = (req, res) => {

}

const updateUser = (reg, res) => {

}

const createUser = (req, res) => {
  if (req.body) {
    const { name, avatar, about } = req.body
    const errors = ["name", "avatar", "about"].filter((field) => !definedString(req.body[field]))
    if (errors.length > 0) {
      http403(res, `Поля '${errors.join(",")}' не указанны`)
    } else {
      User.create({ name, avatar, about })
        .then((user) => http200(res, user))
        .catch((e) => http500(res, e.message))
    }
  } else {
    http403(res, 'Объект пользователя пустой')
  }

}

module.exports = {
  getUser, createUser,
}
