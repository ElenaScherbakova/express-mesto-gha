const { Types } = require("mongoose");
const Card = require("../models/card")
const {
  http200, http403, http500, http201, http400, http404,
} = require("./http-responses");

const http404Internal = (res, cardId) => http404(res, `Карточка с id=${cardId} не найдена.`)

/**
 * Обработчик запроса POST /cards.
 * Возвращает объект созданной карточки. Статус ответа 201.
 * Если карточка содержит ошибки, возвращает 400ю ошибку с описанием ошибок.
 */
const createCard = (req, res) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then((card) => http201(res, card))
    .catch((e) => {
      if (e.name === "ValidationError") {
        http400(res, "Объект карточки содержит ошибки.", e.errors)
      } else {
        http500(res, "Невозможно создать карточку.")
      }
    })
}
/**
 * Обработчик запроса GET /cards.
 * Возвращает все имеющиеся карточки.
 */
const getCards = (req, res) => {
  Card.find({})
    .populate("likes")
    .then((cards) => http200(res, cards))
    .catch(() => http500(res, "Невозможно получить все Карточки."))
}
/**
 * Обработчик запроса DELETE /cards/:cardId.
 * При успешном удалении карточки возвращает 200.
 * Если карточка не найдена возвращает 404ю ошибку.
 * Если пользователь не является создателем карточки, возвращает 403ю ошибку.
 */
const deleteCard = (req, res) => {
  const { cardId } = req.params
  if (Types.ObjectId.isValid(cardId)) {
    Card.findById(cardId)
      .then((card) => {
        if (card) {
          if (card.owner.equals(req.user.id)) {
            return Card.deleteOne(card)
          }
          return Promise.resolve({ forbidden: true })
        }
        return Promise.resolve({ notFound: true })
      })
      .then((result) => {
        const { notFound, forbidden, deletedCount } = result

        if (deletedCount === 1) {
          http200(res, { message: "Карточка успешно удалена." })
        } else if (forbidden) {
          http403(res, "Только автор может удалять свои карточки.")
        } else if (notFound) {
          http404Internal(res, cardId)
        } else {
          throw new Error("")
        }
      })
      .catch(() => {
        http500(res, "Невозможно удалить карточку.")
      })
  } else {
    http400(res, `Карточка с id=${id} не существует.`)
  }
}

/**
 * Функция для внутреннего использования.
 * Добавляет или удаляет лайк текущего пользователя для карточки.
 * Подготавливет http ответы.
 */
const modifyLikes = (req, res, add) => {
  const { cardId } = req.params
  const { _id } = req.user
  if (Types.ObjectId.isValid(cardId)) {
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
      .catch(() => http500(res, "Невозможно добавить like."))
  } else {
    http400(res, `Карточка с id=${cardId} не найдена.`)
  }
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
  createCard, getCards, deleteCard, createLikes, removeLikes,
}
