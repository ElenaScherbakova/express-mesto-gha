const { Types } = require("mongoose")
const User = require("../models/user")
const {
  http404, http403, http200, http500,
} = require("./http-responses");

/**
 * Обработчик запроса GET /users/:userId
 */
const getUser = (req, res) => {
  const { userId } = req.params
  if (Types.ObjectId.isValid(userId)) {
    User.findById(userId)
      .then((user) => {
        if (user) {
          http200(res, user)
        } else {
          http404(res, `Пользователь с id=${userId} не найден.`)
        }
      })
      .catch(() => {
        http500(res, "Невозможно получить пользователя.")
      })
  } else {
    http404(res, `Пользователь с id=${userId} не найден.`)
  }
}

/**
 * Обработчик запроса GET /users.
 * Возвращает всех имеющихся пользователей.
 */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => http200(res, users))
    .catch(() => http500(res, "Невозможно получить всех пользователей."))
}

/**
 * Обработчик запроса POST /users.
 * Создает нового пользователя.
 * Если у пользователя отсутствует хотя бы одно необходимое поле.
 * Сервер возвращает 403ю ошибку с описанием пропущенныз полей.
 */

const createUser = (req, res) => {
  const { name, avatar, about } = req.body
  User.create({ name, avatar, about })
    .then((user) => http200(res, user))
    .catch((e) => {
      if (e.name === "ValidationError") {
        http403(res, "Объект пользователя содержит ошибки.", e.errors)
      } else {
        http500(res, "Невозможно создать пользователя.")
      }
    })
}

module.exports = {
  getUser, createUser, getUsers,
}
