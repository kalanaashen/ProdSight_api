const userService = require("../services/userService");


exports.registerUser=async(req,res)=>{
    try{

        const user=await userService.registerUser({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};


