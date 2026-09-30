const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'ابتدا وارد حساب کاربری خود شوید.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // اطلاعات توکن شامل { id, role } به ریکوئست اضافه می‌شود
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'توکن شما منقضی یا نامعتبر است.' });
  }
};

exports.isSeller = (req, res, next) => {
  // ادمین هم می‌تواند آگهی بگذارد، در غیر این صورت باید حتماً فروشنده باشد
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'فقط حساب‌های فروشگاهی مجاز به ثبت آگهی هستند.' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: "دسترسی غیرمجاز. این عملیات فقط برای ادمین امکان‌پذیر است." 
    });
  }
};