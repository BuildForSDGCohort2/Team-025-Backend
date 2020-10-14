/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const appointments = require('../controllers/appointments');

const AuctionType = {
  Donate: 'Donate',
  Request: 'Request',
  Purchase: 'Purchase'
};

const InstallmentType = {
  Biannual: 'Biannual',
  Annual: 'Annual',
  Monthly: 'Monthly',
  Weekly: 'Weekly',
  Daily: 'Daily'
};

const BloodStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  EXHAUSTED: 'EXHAUSTED',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  PENDING_PAYMENT: 'PENDING_PAYMENT'
};

const bloodSchema = mongoose.Schema(
  {
    description: { type: String, max: 128 },
    status: { type: BloodStatus, default: BloodStatus.AVAILABLE },
    shortLocation: { type: String, max: 32 },
    fullLocation: { type: String, required: true, max: 512 },
    unit: { type: Number, required: true },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bloodGroup: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: { type: Number },
    auctionType: { type: AuctionType },
    installmentType: { type: InstallmentType },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    appointment: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointment' },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
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

const Blood = mongoose.model('Blood', bloodSchema);

module.exports = {
  Blood,
  BloodStatus,
  AuctionType,
  InstallmentType
};
