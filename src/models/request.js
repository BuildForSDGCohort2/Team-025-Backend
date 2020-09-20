const mongoose = require("mongoose");

const BloodRequestStatus = {
  DECLINED: "DECLINED",
  APPROVED: "APPROVED",
  PENDING: "PENDING"
};

const bloodRequestSchema = mongoose
  .Schema(
    {
      bloodId: { type: mongoose.Schema.Types.ObjectId, ref: "Blood", required: true },
      bloodownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      status: { type: BloodRequestStatus, default: BloodRequestStatus.PENDING },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
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
