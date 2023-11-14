const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list, detail, update } = require('../../../controllers/paymentController')


router.post('/create', (...params) => activity(...params, 'PAYMENT', 'CREATE'), (req, res) => {
    create(req, res)
})
router.put('/update/:id', (...params) => activity(...params, 'PAYMENT', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'PAYMENT', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
