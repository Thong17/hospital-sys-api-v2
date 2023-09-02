const express = require('express')
const app = express()

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`App is running on ${process.env.HOST} on port ${process.env.PORT}`)
})