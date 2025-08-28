const mongoose = require('mongoose');

const connectDB = async()=>{
      if (mongoose.connection.readyState === 1){return;}
      try{
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Mongo Connect");
      }catch (err){
            console.log('MongoDB connection error:', err.message);
            process.exit(1);
      }
}

module.exports = connectDB;