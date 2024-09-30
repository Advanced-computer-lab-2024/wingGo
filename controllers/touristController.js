const Tourist = require('../models/tourist');

const tourist_hello = (req,res)=>{
    res.send('<h1>yayy</h1>');
    console.log('yay');
} 

const tourist_register = async(req,res)=>{

    //check on username
    const {username, email, password, mobileNumber,nationality, DOB, type} = req.body;
   try{
      const user = await Tourist.create({username, email, password, mobileNumber,nationality, DOB, type});
      console.log('success');
      res.status(200).json(user);
    //   res.send(user);
   }
   catch(error){
      res.status(400).json({error:error.message});
      console.log('noo');
   }
}

module.exports = {
    tourist_hello,
    tourist_register
}