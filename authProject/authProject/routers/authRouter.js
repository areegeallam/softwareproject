const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router();
router.post('/signup',authController.signup);
router.post('/signin',authController.signin);
router.post('/signout',authController.signout);

router.patch('/send-verification-code',authController.sendVerificationCode) 
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports=router;
