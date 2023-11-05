const mongoose = require('mongoose')

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
        },
        reservation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Reservation',
            required: [true, 'RESERVATION_IS_REQUIRED'],
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.index({ doctor: 1, reservation: 1, approval: 1 }, { unique: true })

module.exports = mongoose.model('DoctorReservation', schema)