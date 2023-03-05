const http500 = (res, message) => {
  res.status(500).send({ message })
}

const http403 = (res, message, errors = {}) => {
  res.status(403).send({ message, errors })
}

const http404 = (res, message) => {
  res.status(404).send({ message })
}

const http200 = (res, data) => {
  res.status(200).send(data)
}

module.exports = {
  http500, http403, http200, http404,
}
