const router = require('express').Router()
const security = require('../../middlewares/security')
const { login, register, refreshToken, profile } = require('../../controllers/authController')

router.post('/login', (req, res) => {
    login(req, res)
})

router.get('/profile', security.auth, (req, res) => {
    profile(req, res)
})

router.post('/register', (req, res) => {
    register(req, res)
})

router.post('/refresh-token', (req, res) => {
    refreshToken(req, res)
})

module.exports = router
