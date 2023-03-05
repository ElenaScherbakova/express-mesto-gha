/**
 * Базовая проверка строку на не пустое значние
 */
const definedString = (str) => typeof str === "string" && str.length > 0

module.exports = {
  definedString,
}
