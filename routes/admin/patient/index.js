const { memoryStorage } = require('../../../configs/multer')
const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list, detail, update, record, history, _export, _validate, _import } = require('../../../controllers/patientController')


router.post('/create', (...params) => activity(...params, 'PATIENT', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'PATIENT', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', (...params) => activity(...params, 'PATIENT', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/record/:id', (req, res) => {
    record(req, res)
})

router.get('/history/:id', (req, res) => {
    history(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})

router.post('/export', (req, res) => {
    _export(req, res)
})

router.post('/validate', memoryStorage.single('excel'), (req, res) => {
    _validate(req, res)
})

router.post('/import', (req, res) => {
    _import(req, res)
})


module.exports = router
