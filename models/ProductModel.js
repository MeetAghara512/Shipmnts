const mongoose =require('mongoose');

const ProductSchema = new mongoose.Schema({
      product_code:{
            type:String,
      },
      qty:{
            type:Number
      },
      volume:{
            type:Number
      },
      location_code:{
            type:String
      }

},{timestamps:true});

module.exports = mongoose.model('Product',ProductSchema);