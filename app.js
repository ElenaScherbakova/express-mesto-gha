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
    // https://expressjs.com/en/starter/faq.html
    /*
        How do I handle 404 responses?
        In Express, 404 responses are not the result of an error
        (404 не является результатом ошибки),
        so the error-handler middleware will not capture them.
        (так что обработчик ошибок их не отловит)
        This behavior is because a 404 response simply indicates the absence
        of additional work to do; in other words, Express has executed all middleware functions and
        routes, and found that none of them responded.
        All you need to do is add a middleware function at the very bottom of the stack
        (Все что вам нужно это добавить middleware функцию в самый конец стопки)
        (below all other functions) to handle a 404 response:
        ```
        app.use((req, res, next) => {
          res.status(404).send("Sorry can't find that!")
        })
        ```
        Сделанно с соответствии с документацией!
        Кидать ошибку что бы тут же поймать ее на две строчки ниже, нет ни какого смысла.
     */
    app.use((req, res) => {
      http404(res, `Ресурс ${req.path} не найден.`)
    })
    /*
        https://github.com/arb/celebrate
        errors([opts])

        Returns a function with the error handler signature ((err, req, res, next)).
        This should be placed with any other error handling middleware to catch celebrate errors.
        If the incoming err object is an error originating from celebrate,
        errors() will respond a pre-build error object.
        Otherwise, it will call next(err) and will pass the error along and will need
        to be processed by another error handler.

        Исходя из вышесказанного, этот middleware должен быть сработать перед
        главным обработчиком Ошибок.

        Противном случае объект ошибки не будет сожержать поле statusCode.
     */
    app.use(errors())
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
