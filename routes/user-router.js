const router = require("express").Router();
const {
  getUser, getUsers, updateUserInformation, updateUserAvatar,
} = require("../controllers/user-controller");

router.get("/", getUsers)
router.get("/me", getUser)
router.patch("/me", updateUserInformation)
router.patch("/me/avatar", updateUserAvatar)

module.exports = router
