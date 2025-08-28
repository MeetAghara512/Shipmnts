const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');


dotenv.config();

const app=express();
const PORT = 8000;

//middleware  - Plugin
app.use(express.json());
app.use(express.urlencoded({extended:false}));


connectDB();

// API

const LocationModel = require('./models/LocationModel');
app.post('/api/create_location',async(req,res)=>{
      const BodyData=req.body;
      // console.log(BodyData.location_code,BodyData.parent_location_code);
      
      const location=BodyData.location_code;
      const parent=BodyData.parent_location_code;

      if(!location){
            return res.status(400).json("Location is not NULL");
      }
      const Payload={
            location_code:location,
            parent_location_code:parent,
            type:"warehouse"
      };

      if(!parent){
            Payload.type="warehouse";
      }else{
            Payload.type="storage";
      }
      // console.log(Payload);
      const data_=new LocationModel(Payload);
      const saved = await data_.save();
      if(!saved){
            return res.status(400).json("something wrong");
      }
      const data = {
            location_code:location,
            parent_location_code:parent,
            type:Payload.type
      }
      return res.status(200).json({
            success:true,
            message: "Location created successfully",
            data 
      })
});

const CreateChild = (locations,parentCode)=>{
      return locations.filter(loc=>loc.parent_location_code===parentCode)
      .map(loc=>({
            location_code:loc.location_code,
            type:loc.type,
            childs:CreateChild(location,loc,location_code)
      }));
}

app.get('/api/warehouse/tree',async(req,res)=>{
      const wareHouseCode = req.query.warehouse_code;
      
      if(!wareHouseCode){
            return res.status(400).json({
                  message:"Ware house code is null"
            });
      }
     try{
            const locations = await LocationModel.find({});
            // console.log(locations);
            const root= locations.find(loc=> loc.location_code === wareHouseCode && loc.type==='warehouse');
            if(!root){
                  return res.status(404).json("Warehouse not found");
            }
            // console.log(root);


            const tree={
                  location_code:root.location_code,
                  type:root.type,
                  childs:CreateChild(locations,root.location_code)
            };
            res.status(200).json(tree);
      }catch(err){
            return res.status(500).json("Something error in second api");
      }
});


const Product = require('./models/ProductModel');
const Transaction = require('./models/TransactionModel');

app.post('/api/transaction/receipt',async(req,res)=>{
      const {transaction_date,warehouse_code,products}=req.body;
      if(!transaction_date || !warehouse_code || !products){
            return res.status(400).json("Data empty");
      }
      // console.log(transaction_date,warehouse_code,products);
      try{
            for(const item of products){
                  // console.log(item.location_code);
                  const locations=await LocationModel.findOne({location_code:item.location_code});
                  if(!locations)return res.status(400).json("location not found");
                  // console.log(locations);
                  // console.log(warehouse_code);
                  if(!(locations.parent_location_code==warehouse_code)){
                        return res.status(400).json("location does not below to warehouse");
                  }
                  // console.log(item.product_code,item.location_code)
                  const product=await Product.findOne({product_code:item.product_code,location_code:item.location_code});
                  if(product){
                        product.qty+=item.qty;
                        product.volume=item.volume;
                  }else{
                        pro = new Product({
                              product_code:item.product_code,
                              qty:item.qty,
                              volume:item.volume,
                              location_code:item.location_code
                        })
                        await pro.save();
                        console.log("product save");
                  }
                  console.log(product);
                  const transaction = new Transaction({transaction_date,warehouse_code,product});
                  await transaction.save();
                  res.json({
                        success:true,
                        message:"Products added successfully"
                  });
            }
      }catch(err){
            return res.status(500).json({
                  success:false,
                  message:"Location Doesn’t belong to a specific warehouse"
            })
      }
});



app.listen(PORT,()=>{console.log(`Server Started at Port : ${PORT}`)});