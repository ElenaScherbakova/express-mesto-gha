const { connect } = require("mongoose")
const express = require("express")
const userRouter = require("./routes/user-router")

const { PORT = 3000 } = process.env

const promise = connect("mongodb://127.0.0.1:27017/mestodb", {

})
promise
  .then(() => {
    const app = express();
    app.use(express.json())
    app.use("/users", userRouter)
    // app.use("/cards", cardsRouter)

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}.`)
    })
  })
  .catch((e) => {
    console.error("Соединение с mongodb не установленно.")
    console.error(e.message)
  })
