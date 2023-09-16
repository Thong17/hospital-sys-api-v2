const router = require('express').Router()
const { login, refreshToken } = require('../../controllers/authController')

router.post('/login', (req, res) => {
    login(req, res)
})

router.post('/refresh-token', (req, res) => {
    refreshToken(req, res)
})

module.exports = router