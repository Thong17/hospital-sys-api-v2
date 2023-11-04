const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list } = require('../../../controllers/exchangeRateController')


router.post('/create', (...params) => activity(...params, 'EXCHANGE_RATE', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'EXCHANGE_RATE', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
