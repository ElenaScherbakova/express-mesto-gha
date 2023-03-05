const router = require("express").Router();
const { createUser, getUser, getUsers } = require("../controllers/user-controller");

router.post("/", createUser)
router.get("/", getUsers)
router.get("/:userId", getUser)

module.exports = router
