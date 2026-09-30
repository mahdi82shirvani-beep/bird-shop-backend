// تابع اول: بررسی ارسال فایل الزامی (گواهی سلامت)
exports.validateOrderFiles = (req, res, next) => {
  const errors = {};
  

  if (!req.files || !req.files['health_certificate']) {
    errors.health_certificate = ['آپلود فایل گواهی سلامت دامپزشکی الزامی است.'];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ 
      success: false, 
      message: 'فرمت فایل گواهی سلامت معتبر نیست', 
      errors 
    });
  }
  next();
};


exports.validateOrderFields = (req, res, next) => {
  const { category_id, sale_type, title, price, province, phone, quantity } = req.body;
  const errors = {};

  if (!category_id) errors.category_id = ['دسته‌بندی الزامی است.'];
  if (!sale_type) errors.sale_type = ['نوع فروش الزامی است.'];
  if (!title) errors.title = ['عنوان آگهی الزامی است.'];
  if (!price) errors.price = ['قیمت الزامی است.'];
  if (!province) errors.province = ['انتخاب استان الزامی است.'];
  if (!phone) errors.phone = ['شماره تماس الزامی است.'];


  if (sale_type === 'wholesale' && !quantity) {
    errors.quantity = ['برای فروش عمده، تعیین تعداد (موجودی) الزامی است.'];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'اطلاعات وارد شده ناقص یا نامعتبر است.', 
      errors 
    });
  }
  next();
};