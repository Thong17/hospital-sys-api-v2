const router = require('express').Router()
const { login, register, refreshToken } = require('../../controllers/authController')

router.post('/login', (req, res) => {
    login(req, res)
})

router.post('/register', (req, res) => {
    register(req, res)
})

router.post('/refresh-token', (req, res) => {
    refreshToken(req, res)
})

module.exports = router
