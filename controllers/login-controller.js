const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const createError = require("http-errors");
const User = require("../models/user");
const { SECRET } = require("../middlewares/auth");

const {
  http201,
  http200,
  http401,
} = require("./http-responses");

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
}
const createUser = (req, res, next) => {
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
        next(e.code === 11000
          ? createError(409, "Пользователь с таким email уже зарегистрирован")
          : e)
      }))
}

module.exports = {
  login,
  createUser,
}
