
//express validation

const express = require('express');
const User = require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');

const JWT_SECRET = "rajatIsAGoodBoy";

// Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res)=>{ 
    //if there are errors return bad request and errors
    const errors = validationResult(req);
    try{
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      //check whether the same email with this email exists
      let user = await User.findOne({email: req.body.email});
      if(user)
      {
        return res.status(400).json({error: "Soory a user already exist with this email. Try using other email"})
      }

      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password, salt);

      user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
        })

        const data={
          user:{
            id:user.id
          }
        }

        const authToken=jwt.sign(data, JWT_SECRET);
        res.json(authToken)
    }
    catch(error)
    { 
      console.log("Some error has occured");
    }
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error: 'Please enter a unique value for email', message: err.message})})
      res.send("hello world");
} )

module.exports = router