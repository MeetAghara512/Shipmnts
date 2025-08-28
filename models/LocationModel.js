const mongoose =require('mongoose');

const WareHouse = new mongoose.Schema({
      location_code:{
            type:String,
      },
      parent_location_code:{
            type:String
      },
      type:{
            type:String
      }
},{timestamps:true});

module.exports = mongoose.model('WareHouseLocation',WareHouse);