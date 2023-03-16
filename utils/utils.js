const validator = (value) => {
  try {
    // eslint-disable-next-line no-new
    const url = new URL(value)
    return url.hostname !== ""
  } catch (e) {
    return false
  }
}

module.exports = {
  validator,
}
