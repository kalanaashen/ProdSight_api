const { min } = require('lodash');
const mongoose=require('mongoose');
const Joi=require('joi');



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:10,
        maxlength:50,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:255,
        trim:true
    }

})

userSchema.methods.generateAuthToken=()=>{
const token = jwt.sign({_id:this._id},config.get("jwtPrivateKey"));
return token;
}

const User=mongoose.model('User',userSchema);


async function validateUser(user){
    const schema=Joi.object({
        name:Joi.string().min(10).max(50).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(8).max(255).required()
    });
    return Joi.validate(user,schema);
}

module.exports.User=User;
module.exports.validateUser=validateUser;
