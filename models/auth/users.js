const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  cName: { type: String, required : true},
  sName:{ type: String, required : true},
  mobile: { type: String , required : true},
  phone: { type: String},
  password: { type: String },
  address:{type: String },
  email: { type: String , unique: true},
  oldEmail: { type: String},
  access:{
    type:String,
    enum:["manager","agent","agency","customer","request"]
  },
  group: { type:String },
  credit: { type: String },
  token: { type: String },
  otp:{ type: String , default: null },
  nif: { type: String },
  imageUrl1:{ type: String },
  imageUrl2:{ type: String },
  kasbUrl:{ type: String },
  
  meliCode:{ type: String },
  postalCode:{ type: String },
  agent:{ type: String },
  active:{ type: String },
  official:{ type: String },
  status:{ type: String },
  Code:{ type: String },
  StockId:{ type: String },
  CustomerID:{ type: String },

  date:{type:Date}
});

module.exports = mongoose.model("user", userSchema);