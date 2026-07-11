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

exports.getUsers = async (req, res) => {
  try {
    res.status(200).send(await userService.getUsers());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getUserByName = async (req, res) => {
  try {
    const user = await userService.getUserByName(req.params.name);
    if (!user) return res.status(404).send({ error: "Employee not found" });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).send({ error: "Employee not found" });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

