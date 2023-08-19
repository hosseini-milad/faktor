const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ProductPriceSchema = new Schema({
    pID: String,
    
    price:String,
    date:{ type: Date }
})
module.exports = mongoose.model('productprice',ProductPriceSchema);