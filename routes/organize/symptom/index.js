const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list } = require('../../../controllers/symptomController')


router.post('/create', (...params) => activity(...params, 'SYMPTOM', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'SYMPTOM', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
