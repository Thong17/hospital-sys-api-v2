const router = require('express').Router()
const { login } = require('../../controllers/authController')

router.post('/login', (req, res) => {
    login(req, res)
})

module.exports = router