const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        approval: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REFUSED'],
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
        patient: {
            type: mongoose.Schema.ObjectId,
            ref: 'Patient',
            required: [true, 'PATIENT_IS_REQUIRED'],
        },
        reservation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Reservation',
            required: [true, 'RESERVATION_IS_REQUIRED'],
        },
        stage: {
            type: String,
            enum: ['PENDING', 'STARTED', 'ENDED'],
            default: 'PENDING'
        },
        patientRecord: {
            type: mongoose.Schema.ObjectId,
            ref: 'PatientHistory',
        },
        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date
        },
        tags: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.index({ doctor: 1, reservation: 1, approval: 1 }, { unique: true })

schema.pre('save', async function (next) {
    await this.populate('doctor patient')
    const note = this.note?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const doctorUsername = this.doctor?.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const doctorFullName = this.doctor?.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const doctorEmail = this.doctor?.email?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const patientUsername = this.patient?.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const patientFullName = this.patient?.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const patientEmail = this.patient?.email?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...note, ...doctorUsername, ...doctorFullName, ...doctorEmail, ...patientUsername, ...patientFullName, ...patientEmail]
    next()
})

module.exports = mongoose.model('Schedule', schema)