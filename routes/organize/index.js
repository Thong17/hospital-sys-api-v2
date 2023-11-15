const router = require('express').Router()

router.use('/stock', require('./stock'))
router.use('/product', require('./product'))
router.use('/symptom', require('./symptom'))
router.use('/category', require('./category'))
router.use('/specialty', require('./specialty'))
router.use('/exchange-rate', require('./exchangeRate'))

module.exports = router