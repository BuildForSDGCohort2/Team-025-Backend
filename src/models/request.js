const mongoose = require("mongoose");

const BloodRequestStatus = {
  DECLINED: "DECLINED",
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED"
};

const bloodRequestSchema = mongoose
  .Schema(
    {
      bloodId: { type: mongoose.Schema.Types.ObjectId, ref: "Blood", required: true },
      auctionType: { type: mongoose.Schema.Types.ObjectId, ref: "Blood", required: true },
      bloodownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      bloodGroup: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      comments: {type: Object, default: 'Urgent'},
      progress: { type: Number, default: 0 },
      required: { type: Number },
      status: { type: BloodRequestStatus, default: BloodRequestStatus.PENDING },
      hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
      volunteers: { type: Object },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, default: new Date() }
    },
    { timestamps: true }
  )
  .set("toJSON", {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });

const Request = mongoose.model("Request", bloodRequestSchema);

module.exports = {
  Request,
  schema: bloodRequestSchema,
  BloodRequestStatus
};
