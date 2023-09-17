const mongoose = require('mongoose')

const main = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
}

main()
    .then(() => console.log(`Database connected to url ${process.env.DATABASE_URL}`))
    .catch(console.error)