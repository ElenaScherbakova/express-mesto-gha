const validator = (value) => {
  try {
    const url = new URL(value)
    return url.hostname !== ""
  } catch (e) {
    return false
  }
}

module.exports = {
  validator,
}
