const express = require('express');
const router = express.Router()
const { registerUser, loginUser, getMe, createUser } = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/', adminOnly, createUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router;