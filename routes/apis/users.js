const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/db');
const path = require('path');

const validateSignUp = require('../../validation/register');
const validateLogin = require('../../validation/login');

const user = require('../../models/user');

router.get('/',(req,res) => {
    return res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/login',(req,res) => {
    return res.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/register', (req,res,next) => {
    const {errors, isValid } = validateSignUp(req.body);
    // if(!isValid) {
    //     var err = new Error('All fields are mandatory');
    //    err.status = 401;
    //    return next(err);
    // }

    user.findOne({
        email: req.body.email
    }).then(userObject => {
        if(userObject) {
            return res.status(400).json({ email:"Email Already exists"});
        } else{
            const newUserRegistration = new user({
                name : req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(newUserRegistration.password,salt,(err,hash) => {
                    if(err) throw err;
                    newUserRegistration.password = hash;
                    newUserRegistration
                    .save()
                    .then(user => res.send('<h1> User registration is successful</h1>'))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});


router.post('/login',(req,res,next) => {
    const {errors, isValid } = validateLogin(req.body);

    if(!isValid) {
       var err = new Error('All fields are mandatory');
       err.status = 401;
       return next(err);
    }

    const email = req.body.email;
    const password = req.body.password;

    user.findOne({email}).then(userObject => {
        if(!userObject) {
            var err1 = new Error('Email is not found');
            err1.status = 401;
            return next(err1);
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
                        console.log('Login SuccessFull')
                        return res.send('<h1>Login Successfull</h1>');
                    }
                );
            } else {
                var err1 = new Error('Password Incorrect');
                err1.status=400;
                return next(err1);
            }
        });
    });
});

router.get('/logout',(req,res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;