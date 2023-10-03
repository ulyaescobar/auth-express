const user = require("../controllers/user_controllers");
const authenticateToken = require('../middleware/auth');
const validateLoginInput = require("../middleware/validate-register");
const router = require('express').Router();

router.post('/login', validateLoginInput, user.login);
router.post('/register', user.register);
router.post('/token', user.refreshToken);
router.get('/me', authenticateToken, user.currentUser);

router.get('/', user.getAll)
router.get('/:id', user.get)
router.put('/:id', authenticateToken, user.update)
router.delete('/:id', user.destroy)

module.exports = router