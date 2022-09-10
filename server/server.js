const express= require("express");
const dotenv=require("dotenv");
const PORT = process.env.PORT || 5000 ;
const connectDB=require ("./config/db.js");
// const data = require("./data/people.json");
const favicon =require("serve-favicon");
const path=require("path");
const cors= require("cors");
const bodyparser =require("body-parser");
// const Contact = require("./models/contactModel");


dotenv.config();
const app=express();

//parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

app.use(express.json());
app.use(cors());

app.use(favicon(path.join(__dirname,"public","favicon.ico")))
app.use(bodyparser.urlencoded({extended:true})); 
app.use(bodyparser.json());   
 connectDB();

 //get from routes auth file
 app.use("/users",require("./routes/auth"));




app.get("/",(req,res)=>{
     res.send("server running on the PAGE")
 })


//Error Handling
app.use((err,req,res,nexe)=>{
    console.error(err.stack);
    res.status(500).send(`Red Alert ${err.stack}`);
});
app.listen(PORT,console.log(`server running now in ${PORT}`));