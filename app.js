const { connect } = require("mongoose")
const cors = require("cors")
const express = require("express")
const {
  celebrate, Joi, Segments, errors,
} = require("celebrate");
const userRouter = require("./routes/user-router")
const cardsRouter = require("./routes/cards-router")
const { http404, http500 } = require("./controllers/http-responses");
const {
  login,
  createUser,
} = require("./controllers/login-controller");
const { checkToken } = require("./middlewares/auth");
const { validator } = require("./utils/utils");

const { PORT = 3000 } = process.env

connect("mongodb://127.0.0.1:27017/mestodb", {})
  .then(() => {
    const app = express();
    app.use(cors())
    app.use(express.json())
    app.post(
      "/signin",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required().email(),
          password: Joi.string().required(),
        }),
      }),
      login,
    )
    app.post(
      "/signup",
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          name: Joi.string().min(2).max(30),
          email: Joi.string().required().email(),
          password: Joi.string()
            .required(),
          about: Joi.string().min(2).max(30),
          avatar: Joi.string().custom((value, helper) => (validator(value)
            ? value
            : helper.message({ custom: "Неправильный URL" }))),
        }),
      }),
      createUser,
    )
    app.use(checkToken)
    app.use("/users", userRouter)
    app.use("/cards", cardsRouter)
    app.use(errors())
    app.use((req, res) => {
      http404(res, `Ресурс ${req.path} не найден.`)
    })
    app.use((err, req, res, next) => {
      // https://expressjs.com/en/guide/error-handling.html
      // So when you add a custom error handler, you must delegate to the default
      // Express error handler, when the headers have already been sent to the client:
      if (!res.headersSent) {
        if (err.statusCode > 0) {
          res
            .status(err.statusCode)
            .send({ message: err.message })
        } else {
          http500(res, "Непредвиденная ошибка сервера")
        }
        // Eslint-error: Expected to return a value at the end of arrow function  consistent-return
        return null
      }
      return next(err)
    })
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}.`)
    })
  })
  .catch((e) => {
    console.error("Соединение с mongodb не установленно.")
    console.error(e.message)
  })
