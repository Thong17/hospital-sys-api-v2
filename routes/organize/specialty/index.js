const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list } = require('../../../controllers/specialtyController')


router.post('/create', (...params) => activity(...params, 'SPECIALTY', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'SPECIALTY', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
