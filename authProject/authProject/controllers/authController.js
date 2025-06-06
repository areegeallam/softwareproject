const { signupSchema, signinSchema } = require("../middlewares/validator");
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const transport = require("../middlewares/sendEmail");



exports.signup = async (req,res) => {
    const {email,password,name}= req.body;
    try{
        const {error,value} = signupSchema.validate({email,password,name});


        if(error){
            return res.status(401).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(401).json({success:false,message:'User Already exists'})
        }
        const hashPassword = await doHash(password,12);
        const newUser = new User({
            email,
            name,
            password:hashPassword,
        })
        const result = await newUser.save();
        result.password=undefined;
        res.status(201).json({
            success:true,message:"Your account has been created successfully",
            result,
        })

    }catch(error){
        console.log(error)

    }
}

exports.signin = async(req,res)=>{
    const {email,password} =req.body;
    try{
        const {error,value} = signinSchema.validate({email,password})
        if(error){
            return res.status(401).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({email}).select('+password')
        if(!existingUser){

            return res.status(401).json({success:false,message:'User dose not exists'})
        }
        const result = await doHashValidation(password,existingUser.password)
        if(!result){
            return res.status(401).json({success:false,message:'Invalid credentials!'})
        }
        
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,  // المفتاح السري
            {
                expiresIn: '8h',  // إعدادات انتهاء صلاحية الـ token
            }
        );


    res.cookie('Authorization','Bearer'+token,{expires:new Date(Date.now()+8*3600000)
        ,httpOnly:process.env.NODE_ENV ==='production',
        secure:process.env.NODE_ENV ==='production'
    }).json({
        success:true,
        token,
        message:"logged in successfully"
    })


    }catch(error){
        console.log(error)
    }

}




exports.signout= async(req,res)=>{
    res.clearCookie('Authorization').status(200).json({
        success:true,
        message:'logged out successfully'
    })
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }
        if (existingUser.verified) {
            return res.status(401).json({ success: false, message: 'User already verified!' });
        }

        const codeValue = Math.floor(Math.random() * 100000).toString();
        
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Verification Code",
            html: '<h1>' + codeValue + '</h1>',
        });

        // تحقق من أن البريد الإلكتروني قد تم قبوله
        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Code Sent' });
        }

        // في حال فشل إرسال البريد
        res.status(500).json({ success: false, message: 'Failed to send code' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};