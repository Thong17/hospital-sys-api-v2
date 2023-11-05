const mongoose = require('mongoose')
const Reservation = require('./Reservation')
const Doctor = require('./Doctor')

const schema = new mongoose.Schema(
    {
        approval: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
            default: 'PENDING'
        },
        note: {
            type: String
        },
        doctor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Doctor',
            required: [true, 'DOCTOR_IS_REQUIRED'],
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const doctor = await Doctor.findById(id)
                            resolve(!!doctor)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'DOCTOR_IS_NOT_EXIST'
            },
        },
        reservation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Reservation',
            required: [true, 'RESERVATION_IS_REQUIRED'],
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const reservation = await Reservation.findById(id)
                            resolve(!!reservation)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'RESERVATION_IS_NOT_EXIST'
            },
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('DoctorReservation', schema)