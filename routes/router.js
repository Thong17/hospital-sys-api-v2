const router = require('express').Router()
const response = require('../helpers/response')
const { minioClient } = require('../configs/multer')
const security = require('../middlewares/security')

router.get('/upload/:filename', async (req, res) => {
    try {
        let filename = req.params.filename ?? 'default.png'
        let bucketName = req.query.bucket ?? process.env.MINIO_BUCKET
        let mimetype = req.query.mimetype ?? 'image/jpeg'
        if (['null', 'undefined'].includes(filename)) filename = 'default.png'
        if (['null', 'undefined'].includes(bucketName)) bucketName = process.env.MINIO_BUCKET
        if (['null', 'undefined'].includes(mimetype)) mimetype = 'image/jpeg'
        const stream = await minioClient.getObject(bucketName, filename)
        res.set('Content-Type', mimetype)
        stream.pipe(res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
})

router.use(security.hash)
router.use('/auth', require('./auth'))
router.use(security.auth)
router.use('/home', require('./home'))
router.use('/admin', require('./admin'))
router.use('/organize', require('./organize'))
router.use('/operation', require('./operation'))

module.exports = router