const mongoose = require('mongoose');

UserSchema = new mongoose.Schema(

{
  Name{
    type: String,
    required: true
  },
  email{
    type: String,
    required: true
  },
  city{
    type: String,
    required: true
  },
  phone{
    type: String,
    required:true
  },
  bloodgroup{
    type: String,
    required: true
  },
  address{
    type: String,
    required: true
  }
   
});

module.exports = mongoose.model("User", UserSchema);