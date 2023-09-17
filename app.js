require('dotenv').config()
require('./configs/database')
const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(logger('common'))
app.use(express.urlencoded({ extended: true }))

// Routing
app.use('/', require('./routes/router'))

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`App is running on ${process.env.HOST} on port ${process.env.PORT}`)
})