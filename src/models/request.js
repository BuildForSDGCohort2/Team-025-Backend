const mongoose = require('mongoose');

const BloodRequestStatus = {
  DECLINED: 'DECLINED',
  APPROVED: 'APPROVED',
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
};

const bloodRequestSchema = mongoose
  .Schema(
    {
      bloodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blood' },
      // auctionType: { type: mongoose.Schema.Types.ObjectId, ref: "Blood", required: true },
      bloodOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      bloodReceiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      bloodGroup: { type: String, required: true },
      bloodOwnerBloodGroup: { type: String },
      comments: { type: Object, default: 'Urgent' },
      progress: { type: Number, default: 25 },
      // required: { type: Number },
      status: { type: BloodRequestStatus, default: BloodRequestStatus.PENDING },
      hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
      appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
      // volunteers: { type: Object },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, default: new Date() }
    },
    { timestamps: true }
  )
  .set('toJSON', {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });

const Request = mongoose.model('Request', bloodRequestSchema);

module.exports = Request;
