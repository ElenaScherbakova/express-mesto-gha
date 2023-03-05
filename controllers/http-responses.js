const http500 = (res, message) => {
  res.status(500).send({ message })
}

const http403 = (res, message) => {
  res.status(403).send({ message })
}

const http200 = (res, data) => {
  res.status(200).send(data)
}

module.exports = {
  http500, http403, http200,
}
