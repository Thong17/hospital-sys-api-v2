const router = require('express').Router()
const { sale, product } = require('../../controllers/reportController')

router.get('/sale', (req, res) => {
    sale(req, res)
})

router.get('/product', (req, res) => {
    product(req, res)
})

module.exports = router