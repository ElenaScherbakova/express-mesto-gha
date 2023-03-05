const router = require("express").Router();
const {
  createUser, getUser, getUsers, updateUserInformation, updateUserAvatar,
} = require("../controllers/user-controller");

router.post("/", createUser)
router.get("/", getUsers)
router.get("/:userId", getUser)
router.patch("/me", updateUserInformation)
router.patch("/me/avatar", updateUserAvatar)

module.exports = router
