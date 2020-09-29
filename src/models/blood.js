/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

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
  EXHAUSTED: 'EXHAUSTED',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  PENDING_PAYMENT: 'PENDING_PAYMENT'
};

const bloodSchema = mongoose.Schema(
  {
    description: { type: String, max: 128 },
    status: { type: BloodStatus, default: BloodStatus.AVAILABLE },
    shortLocation: { type: String, required: true, max: 32 },
    fullLocation: { type: String, required: true, max: 512 },
    unit: { type: Number, required: true },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: { type: Number, required: true },
    auctionType: { type: AuctionType, required: true },
    installmentType: { type: InstallmentType, required: true },
    requests: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Request' }]
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
