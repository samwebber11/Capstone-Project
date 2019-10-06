const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/db');

const validateSignUp = require('../../validation/register');
const validateLogin = require('../../validation/login');

const user = require('../../models/user');

router.post('/signup', (req,res) => {
    const {errors, isValid } = validateSignUp(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    user.findOne({
        email: req.body.email
    }).then(userObject => {
        if(userObject) {
            return res.status(400).json({ email:"Email Already exists"});
        } else{
            const newUserRegistration = new user({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName : req.body.userName,
                email: req.body.email,
                password: req.body.password,
            });

            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(newUserRegistration.password,salt,(err,hash) => {
                    if(err) throw err;
                    newUserRegistration.password = hash;
                    newUserRegistration
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});


router.post('/login',(req,res) => {
    const {erros, isValid } = validateLogin(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    user.findOne({email}).then(userObject => {
        if(!userObject) {
            return res.status(404).json({emailnotfound: "Email not Found"});
        }

        bcrypt.compare(password, userObject.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    id:userObject.id,
                    name: userObject.userName
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err,token) => {
                        res.json({
                            message: " User login successfull",
                            success: true,
                            token: token
                        });
                    }
                );
            } else {
                return res
                .status(400)
                .json({ passwordincorrect: "Password Incorrect "});
            }
        });
    });
});

module.exports = router;