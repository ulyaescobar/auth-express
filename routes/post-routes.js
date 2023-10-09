const post = require("../controllers/post_controllers")
const authenticateToken = require("../middleware/auth")
const router = require("express").Router()

router.get("/", post.index);
router.get("/my_posts", authenticateToken, post.my_index)
router.get("/:id", post.show)
router.put("/:id", authenticateToken, post.update)
router.post("/", authenticateToken, post.create)
router.delete("/:id", authenticateToken, post.destroy)

module.exports = router;