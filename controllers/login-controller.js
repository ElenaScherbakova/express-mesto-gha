const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const { SECRET } = require("../middlewares/auth");

const {
  http409,
  http201,
  http400,
  http500,
  http200,
  http401,
} = require("./http-responses");

const validationCatch = (res, e) => {
  if (e.code === 11000) {
    http409(res, "Пользователь с таким email уже зарегистрирован")
  } else if (e.name === "ValidationError") {
    http400(res, e)
  } else {
    http500(res, "Невозможно создать пользователя.")
  }
}
const login = (req, res) => {
  const { email, password } = req.body

  User.findOne({ email }).select("+password")
    .then((user) => {
      if (user && bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ _id: user._id }, SECRET)
        http200(res, { token })
      } else {
        http401(res, "Не правильный логин или пароль")
      }
    })
    .catch(() => {
      http500(res, "Непредвиденная ошибка")
    })
}
const createUser = (req, res) => {
  const {
    name, avatar, about, email, password,
  } = req.body
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, avatar, about, email, password: hash,
    })
      .then((user) => {
        const u = user.toJSON()
        delete u.password
        http201(res, u)
      })
      .catch((e) => {
        validationCatch(res, e)
      }))
}

module.exports = {
  login,
  createUser,
}
