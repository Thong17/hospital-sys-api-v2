const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { list, detail, start, end } = require('../../../controllers/scheduleController')


router.post('/start/:id', (...params) => activity(...params, 'SCHEDULE', 'ACCEPT'), (req, res) => {
    start(req, res)
})

router.post('/end/:id', (...params) => activity(...params, 'SCHEDULE', 'REFUSE'), (req, res) => {
    end(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
