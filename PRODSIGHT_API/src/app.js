const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();



app.use(cors());
app.use(express.json());
app.use("/api/users",require("./routes/users"));
app.use("/api/auth",require("./routes/auth"));

app.get("/",(req,res)=>{
    res.send("Prodsight API running");
})

module.exports=app;