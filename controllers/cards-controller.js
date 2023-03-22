const createError = require("http-errors")
const Card = require("../models/card")
const {
  http200,
  http201,
  http404,
} = require("./http-responses");

const http404Internal = (res, cardId) => http404(res, `Карточка с id=${cardId} не найдена.`)

/**
 * Обработчик запроса POST /cards.
 * Возвращает объект созданной карточки. Статус ответа 201.
 * Если карточка содержит ошибки, возвращает 400ю ошибку с описанием ошибок.
 */
const createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body
  Card.create({
    name,
    link,
    owner: req.user._id,
  }).then((card) => http201(res, card))
}
/**
 * Обработчик запроса GET /cards.
 * Возвращает все имеющиеся карточки.
 */
const getCards = (req, res) => {
  Card.find({})
    .populate("likes")
    .then((cards) => http200(res, cards))
}
/**
 * Обработчик запроса DELETE /cards/:cardId.
 * При успешном удалении карточки возвращает 200.
 * Если карточка не найдена возвращает 404ю ошибку.
 * Если пользователь не является создателем карточки, возвращает 403ю ошибку.
 */
const deleteCard = (req, res, next) => {
  const { cardId } = req.params
  Card.findById(cardId)
    .then((card) => {
      if (card) {
        if (card.owner.equals(req.user._id)) {
          Card.deleteOne(card).then(() => {
            http200(res, { message: "Карточка успешно удалена." })
          })
        } else {
          next(createError(403, "Только автор может удалять свои карточки"))
        }
      } else {
        next(createError(404, `Картчока с id=${cardId} не найдена`))
      }
    })
}

/**
 * Функция для внутреннего использования.
 * Добавляет или удаляет лайк текущего пользователя для карточки.
 * Подготавливет http ответы.
 */
const modifyLikes = (req, res, add) => {
  const { cardId } = req.params
  const { _id } = req.user

  const action = add
    ? "$addToSet"
    : "$pull"

  Card.findByIdAndUpdate({ _id: cardId }, {
    [action]: {
      likes: _id,
    },
  }, { returnDocument: "after" })
    .then((card) => {
      if (card) {
        http200(res, card)
      } else {
        http404Internal(res, cardId)
      }
    })
}
/**
 * Обработчик запроса PATCH /cards/:cardId/likes.
 * Добавляет в список лайков, текущего пользователя.
 */
const createLikes = (req, res) => {
  modifyLikes(req, res, true)
}

/**
 * Обработчик запроса DELETE /cards/:cardId/likes.
 * Удаляет из списка лайков, текущего пользователя.
 */
const removeLikes = (req, res) => {
  modifyLikes(req, res, false)
}

module.exports = {
  createCard,
  getCards,
  deleteCard,
  createLikes,
  removeLikes,
}
