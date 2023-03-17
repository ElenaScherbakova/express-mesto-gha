const User = require("../models/user")
const {
  http404, http200, http500, http201, http400,
  http409,
} = require("./http-responses");

const validationCatch = (res, e) => {
  if (e.code === 11000) {
    http409(res, "Пользователь с таким email уже зарегистрирован")
  }
  if (e.name === "ValidationError") {
    http400(res, "Объект пользователя содержит ошибки.", e.errors)
  } else {
    http500(res, "Невозможно создать пользователя.")
  }
}

const findUser = (userId, res) => {
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
    .catch(() => http500(res, "Невозможно получить всех пользователей."))
}

/**
 * Обработчик запроса POST /users.
 * Создает нового пользователя.
 * Если у пользователя отсутствует хотя бы одно необходимое поле,
 * сервер возвращает 400ю ошибку с описанием ошибок.
 *
 * Ответ содержит объект созданного пользователя.
 * Статус ответа 201.
 */
const createUser = (req, res) => {
  const {
    name, avatar, about, email, password,
  } = req.body
  User.create({
    name, avatar, about, email, password,
  })
    .then((user) => http201(res, user))
    .catch((e) => validationCatch(res, e))
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
    .catch((e) => validationCatch(res, e))
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
  getMe, getUser, createUser, getUsers, updateUserInformation, updateUserAvatar,
}
