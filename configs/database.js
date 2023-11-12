const mongoose = require('mongoose')
const User = require('../models/User')
const Role = require('../models/Role')
const { encryptPassword } = require('../helpers/utils')

const main = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
}

main()
    .then(async () => {
        const userCount = await User.countDocuments()
        if (userCount === 0) {
            const privilege = {
                admin: {
                    role: {
                        list: true,
                        create: true,
                        update: true,
                        detail: true,
                        delete: true,
                    },
                    user: {
                        list: true,
                        create: true,
                        update: true,
                        detail: true,
                        delete: true,
                    }
                }
            }
            const navigation = {
                admin: {
                    role: true,
                    user: true,
                }
            }
            const role = await Role.create({ name: { English: 'Super Admin', privilege, navigation } })
            const password = await encryptPassword(`SuperAdmin${process.env.PASSWORD_DEFAULT}`)
            await User.create({ username: 'SuperAdmin', role: role?._id, password, status: true })
        }
        console.log(`Database connected to url ${process.env.DATABASE_URL}`)
    })
    .catch(console.error)