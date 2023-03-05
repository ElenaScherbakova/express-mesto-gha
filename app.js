const { connect } = require("mongoose")
const express = require("express")
const userRouter = require("./routes/user-router")

const { PORT = 3000 } = process.env

connect("mongodb://localhost:27017/mongodb", {
  useNewUrlParser: true,
})

const app = express();
app.use(express.json())
app.use("/users", userRouter)
// app.use("/cards", cardsRouter)

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
