const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const Otp = require('./otp.model');
const { sendOtpSms } = require('../../services/sms.service');

// ۱. درخواست ارسال کد تایید
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'شماره موبایل الزامی است' });


  const code = Math.floor(10000 + Math.random() * 90000).toString();

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 

  try {
    
    await Otp.destroy({ where: { phone } });

    "Otp crate to database :" , await Otp.create({ phone, code, expiresAt });
    
    await sendOtpSms(phone, code);

    res.json({ message: 'کد تایید با موفقیت ارسال شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
};

// ۲. تایید کد و ورود/ثبت‌نام کاربر
exports.verifyOtp = async (req, res) => {
  const { phone, code } = req.body;

  try {
   
    const otpRecord = await Otp.findOne({ where: { phone, code } });
    
    if (!otpRecord) return res.status(400).json({ message: 'کد وارد شده اشتباه است' });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'کد منقضی شده است' });

    let user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await User.create({ phone, role: 'buyer' });
    }


    await otpRecord.destroy();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // توکن ۷ روز اعتبار دارد
    );

    res.json({ message: 'ورود موفقیت‌آمیز بود', token, user });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
};