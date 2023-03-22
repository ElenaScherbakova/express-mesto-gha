const User = require("../models/user")
const {
  http404, http200,
} = require("./http-responses");

const findUser = (userId, res) => {
  User.findById(userId)
    .then((user) => {
      if (user) {
        http200(res, user)
      } else {
        http404(res, `Пользователь с id=${userId} не найден.`)
      }
    })
}

/**
 * Обработчик запроса GET /users/:userId
 * Если пользователь не найден, сервер возвращает 404ю ошибку.
 * Ответ содержит объект найденного пользователя.
 */
const getMe = (req, res) => {
  findUser(req.user._id, res)
}

const getUser = (req, res) => {
  findUser(req.params.userId, res)
}

/**
 * Обработчик запроса GET /users.
 * Возвращает всех имеющихся пользователей.
 */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => http200(res, users))
}

/**
 * Метод для внутреннего использования.
 * Обновляет объект пользователя по id.
 */
const updateUserInternal = (id, res, update) => {
  User.findByIdAndUpdate(id, update, { returnDocument: "after", runValidators: true, context: "query" })
    .then((user) => {
      http200(res, user)
    })
}

/**
 * Обработчик запроса POST /users/me/avatar.
 * Обновляет только поле avatar.
 * Если поле не верно то,
 * сервер возвращает 400ю ошибку с описанием ошибки.
 * Ответ содержит объект обновленного пользователя.
 */

const updateUserInformation = (req, res) => {
  const { name, about } = req.body
  updateUserInternal(req.user._id, res, { name, about })
}

/**
 * Обработчик запроса POST /users/me.
 * Обновляет только поля name и about.
 * Если у пользователя отсутствует хотя бы одно необходимое поле,
 * сервер возвращает 400ю ошибку с описанием ошибок.
 * Ответ содержит объект обновленного пользователя.
 */
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  updateUserInternal(req.user._id, res, { avatar })
}

module.exports = {
  getMe, getUser, getUsers, updateUserInformation, updateUserAvatar,
}
