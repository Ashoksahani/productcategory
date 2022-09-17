const mongoose=require('mongoose')
//const ObjectId = mongoose.Schema.Types.ObjectId;



const productSchema= new mongoose.Schema({
      
    productName:{
        type:String,
        required:[true,'enter the product name'],
        trim:true
    },
    
    description: {
        type: String,
        required: [true,'enter the description'],
        trim: true
    },
    category : {
        type: String,
        trim: true
    },
    
    price: { // valid number decimal
        type: Number,
        required:[ true,'enter the price'],
        trim: true
    },

    productType: [{ //at least one type
        type: String,
        trim: [true,'enter the product type'],
        enum: ["equipments","clothings","accessories"]
    }],

   isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps:true})


module.exports = mongoose.model('product',productSchema);

