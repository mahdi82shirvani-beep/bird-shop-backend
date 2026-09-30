const axios = require('axios');

const sendOtpSms = async (phone, code) => {
  try {
    // نمونه اتصال به وب‌سرویس پیامک (کاوه‌نگار، ملی‌پيامک و...)
    // const url = 'https://api.sms-provider.com/send';
    // await axios.post(url, {
    //   receptor: phone,
    //   message: `کد تایید فروشگاه پرنده: ${code}`
    // });
    
    // فعلا برای تست در ترمینال چاپ می‌کنیم تا بتونی لاگین کنی
    console.log(`\n🔔 [SMS MOCK] => ارسال کد ${code} به شماره ${phone}\n`);
    
    return true;
  } catch (error) {
    console.error('خطا در ارتباط با وب‌سرویس پیامک:', error);
    throw new Error('ارسال پیامک با شکست مواجه شد');
  }
};

module.exports = { sendOtpSms };