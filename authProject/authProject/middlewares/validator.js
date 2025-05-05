const Joi = require('joi');

exports.signupSchema = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    password: Joi.string().required().pattern(/^[A-Za-z0-9]{4,}$/),
    name:Joi.string().required().min(3).max(15)

})


exports.signinSchema = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    password: Joi.string().required().pattern(/^[A-Za-z0-9]{4,}$/),
    

})