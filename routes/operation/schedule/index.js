const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { list, detail, start, update, end } = require('../../../controllers/scheduleController')


router.post('/start/:id', (...params) => activity(...params, 'SCHEDULE', 'START'), (req, res) => {
    start(req, res)
})

router.post('/update/:id', (...params) => activity(...params, 'SCHEDULE', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.post('/end/:id', (...params) => activity(...params, 'SCHEDULE', 'END'), (req, res) => {
    end(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})


module.exports = router
