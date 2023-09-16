const router = require('express').Router()
const { content } = require('../../controllers/homeController')

router.get('/content', (req, res) => {
    content(req, res)
})

module.exports = router