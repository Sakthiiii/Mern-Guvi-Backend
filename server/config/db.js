const mongoose= require("mongoose");

const connenctDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true
        });
        console.log("MongoDB connected")
    }catch(error){
        console.error(`Error:${error.message}`);
        process.exit(1);
    }
}
module.exports= connenctDB;