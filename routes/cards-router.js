const router = require("express").Router();
const {
  createCard, getCards, deleteCard, createLikes, removeLikes,
} = require("../controllers/cards-controller");

router.post("/", createCard)
router.get("/", getCards)
router.delete("/:cardId", deleteCard)
router.put("/:cardId/likes", createLikes)
router.delete("/:cardId/likes", removeLikes)

module.exports = router
