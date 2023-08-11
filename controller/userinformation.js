const model = require('../model/userinformation');
const userdata = model.userdatas;
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

exports.createuser = async(req,res)=>{
    try {
        const userData = new userdata(req.body);
        const hash = bcrypt.hashSync(req.body.password, 10);
        userData.password = hash;
        var token = jwt.sign({ email: req.body.email }, 'shhhhh');
        userData.token = token;
        const savedData = await userData.save();
        res.status(201).json(savedData);
      } catch (error) {
        res.status(500).json({ message: 'An error is occurred in creating user successfully in the database' });
      }
}

exports.verifyuser = async(req,res)=>{
    try {
      const userinfo = await userdata.findOne({email:req.body.email})
      const ispassword = bcrypt.compareSync(req.body.password, userinfo.password);
      // if (ispassword && (req.body.token===userinfo.token)){
      if (ispassword){
        // res.status(200).json({message:"Your are successfully login to your account"});
        res.status(200).json(userinfo);
      }
      }
      catch (error) {
        console.log(error)
        res.status(401).json({ message: "Your account is not created yet, create your account first" });
      }
}

exports.getloginuser = async(req,res)=>{
    try {
      const loginuserinfo = await userdata.findOne({token:req.params.token})
      res.status(200).json(loginuserinfo)
      }
      catch (error) {
        res.status(400).json({ message: "Your account is not created yet, create your account first" });
      }
}

exports.getallusersexceptloginuser = async(req,res)=>{
    try {
      const allUserData = await userdata.find();
      const filteredUserData = allUserData.filter((userData) => userData.token !== req.params.token);
      res.status(200).json(filteredUserData);
      }
      catch (error) {
        res.status(400).json({ message: "Error in fetching users" });
      }
}

exports.getuserwhichisclick = async(req,res)=>{
    try {
      const id = req.params.id;
      const UserData = await userdata.findById(id);
      res.status(200).json(UserData);
      }
      catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in fetching user which is click" });
      }
}


