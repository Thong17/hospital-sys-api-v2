const router = require('express').Router()
const { sale, product, listTransaction } = require('../../controllers/reportController')

router.get('/sale', (req, res) => {
    sale(req, res)
})

router.get('/product', (req, res) => {
    product(req, res)
})

router.get('/transaction', (req, res) => {
    listTransaction(req, res)
})

module.exports = router