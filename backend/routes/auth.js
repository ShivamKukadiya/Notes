const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');  // for validation of data in request
const { toHaveFormValues } = require('@testing-library/jest-dom/dist/matchers');

const JWT_SECRET = 'Thisisimportantandweneedtosecureit';

// Route 1: Create a User using: POST "/api/auth/createuser" --No login required

// synax of express-validator is given below after path write validation and then req and res part
router.post('/createuser', [
    body('name', 'Enter valid Name').isLength({ min: 3 }),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Enter valid Password').isLength({ min: 3 }),
], async (req, res) => {
    let success = false;
    // if error occurs then return bed request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether user with this email is already exist or not
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry user with this name is already exist" })
        }

        // Generating a salt for Passwords
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt) //making password strong using hashing, salt and pepper

        // Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        // Getting id from data and making token using - JSON Web Token
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken });

        // catch error when code is not run properly
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})


// Route 2: Login using: POST "/api/auth/login" --No login required

router.post('/login', [
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Enter valid Password').exists(),
], async (req, res) => {
    let success = false;
    // if error occurs then return bed request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // this is destructring to save values
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Plese Enter valid credential" });
        }

        // compare passsword in bcrypt first value is entered by user and second is hash(hased password with salt) 
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            success = false;
            return res.status(400).json({ success, error: "Plese Enter valid password" });
        }

        // Getting id from data and making token using - JSON Web Token
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// Route 3: Get loggedin user detail: POST "/api/auth/getuser" --login required

router.post('/getuser', fetchuser, async (req, res) => {

    // if error occurs then return bed request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // this is destructring to save values
    const { email, password } = req.body;
    try {
        //Getting token we take it from middleware->fetchuser 
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

module.exports = router;