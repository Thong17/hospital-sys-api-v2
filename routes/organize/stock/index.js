const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list, detail, update, history } = require('../../../controllers/stockController')


router.post('/create', (...params) => activity(...params, 'STOCK', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'STOCK', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', (...params) => activity(...params, 'STOCK', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/history/:id', (req, res) => {
    history(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})

module.exports = router
