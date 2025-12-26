const mongoose = require('mongoose')

const connectDb =()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("order db connected successfully")
    })
    .catch(error=>{
        console.log("some error due to :",  error)
    })
}

module.exports=connectDb