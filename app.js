const { connect } = require("mongoose")
const cors = require("cors")
const express = require("express")
const userRouter = require("./routes/user-router")
const cardsRouter = require("./routes/cards-router")
const { http404 } = require("./controllers/http-responses");
const {
  login,
  createUser,
} = require("./controllers/login-controller");
const { checkToken } = require("./middlewares/auth");

const { PORT = 3000 } = process.env

connect("mongodb://127.0.0.1:27017/mestodb", {})
  .then(() => {
    const app = express();
    app.use(cors())
    app.use(express.json())
    app.post("/signin", login);
    app.post("/signup", createUser);
    app.use(checkToken)
    app.use("/users", userRouter)
    app.use("/cards", cardsRouter)
    app.use((req, res) => {
      http404(res, `Ресурс ${req.path} не найден.`)
    })
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}.`)
    })
  })
  .catch((e) => {
    console.error("Соединение с mongodb не установленно.")
    console.error(e.message)
  })
