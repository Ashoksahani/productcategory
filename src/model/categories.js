const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const product=require('../model/product.js')

const categorySchema = new Schema({
    name: { type: String, required: true, trim:true },
    description: { type: String,trim:true },
    products: [{
        required: true, 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
       
    }],
    image:{
        type:String,
        trim:true
    },
   
    isDeleted: { type: Boolean, default: false }, 
    
    
},{timestamps:true});

module.exports = mongoose.model('Category', categorySchema);