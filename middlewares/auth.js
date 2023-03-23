const jwt = require("jsonwebtoken");
const createError = require("http-errors")

const SECRET = "random-string"
const checkToken = (req, res, next) => {
  let success = false
  const { authorization = "" } = req.headers;
  const token = authorization.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : null

  if (token) {
    try {
      req.user = jwt.verify(token, SECRET)
      success = true
    } catch (err) {
      // Ignore
    }
  }

  if (success) next()
  else next(createError(401, "Необходима авторизация"))
}

module.exports = { checkToken, SECRET }
