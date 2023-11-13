const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { list, detail, create, update } = require('../../../controllers/transactionController')


router.post('/create', (...params) => activity(...params, 'TRANSACTION', 'CREATE'), (req, res) => {
    create(req, res)
})

router.put('/update/:id', (...params) => activity(...params, 'TRANSACTION', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
