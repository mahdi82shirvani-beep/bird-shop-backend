const Order = require('./order.model');
const { Op } = require('sequelize');


exports.createOrder = async (req, res) => {
  try {
    const { 
      category_id, sale_type, title, price, age, gender, 
      description, ring_number, quantity, province, phone, contact_method 
    } = req.body;

    // استخراج مسیر فایل‌های آپلود شده
    const healthCertificatePath = req.files['health_certificate'][0].path;
    
    // اگر عکسی فرستاده بودند مسیرها را می‌گیریم (آرایه []images طبق درخواست فرانت)
    let imagesPaths = [];
    if (req.files['images[]']) {
      imagesPaths = req.files['images[]'].map(file => file.path);
    }

    // ثبت در دیتابیس
    const newOrder = await Order.create({
      categoryId: category_id,
      saleType: sale_type,
      title: title,
      price: price,
      age: age,
      gender: gender,
      description: description,
      ringNumber: ring_number,
      quantity: quantity,
      province: province,
      phone: phone,
      contactMethod: contact_method,
      healthCertificate: healthCertificatePath,
      images: JSON.stringify(imagesPaths), // تبدیل آرایه عکس‌ها به استرینگ برای SQLite
      sellerId: req.user.id // شناسه فروشنده از توکن خوانده می‌شود
    });

    // خروجی دقیقاً منطبق با داکیومنت فرانت‌اند
    return res.status(201).json({
      success: true,
      message: "آگهی شما با موفقیت ثبت شد و پس از بررسی منتشر می‌شود.",
      redirectUrl: `/listings/${newOrder.id}`
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطای سرور در ثبت آگهی",
      errors: { server: ["مشکلی در ارتباط با سرور پیش آمد."] }
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    
    const { category, province, sort } = req.query;

    
    let whereClause = {}; 
    let orderClause = [['createdAt', 'DESC']]; 

    
    if (category) {
      whereClause.categoryId = category; 
    }
    
    if (province) {
      whereClause.province = province;
    }

    // ۴. اعمال مرتب‌سازی‌های از پیش تعیین شده
    if (sort === 'cheapest') {
      orderClause = [['price', 'ASC']]; // قیمت از کم به زیاد
    } else if (sort === 'expensive') {
      orderClause = [['price', 'DESC']]; // قیمت از زیاد به کم
    } else if (sort === 'oldest') {
      orderClause = [['createdAt', 'ASC']]; // قدیمی‌ترین
    }

    const orders = await Order.findAll({
      where: whereClause,
      order: orderClause,
      // اگر می‌خواهی اطلاعات فروشنده هم همراه آگهی بیاید (Join):
      // include: [{ model: User, as: 'seller', attributes: ['fullName', 'phone'] }] 
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'خطای سرور در دریافت آگهی‌ها' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    // شناسه فروشنده از توکن احراز هویت گرفته می‌شود
    const sellerId = req.user.id;

    // جستجوی تمام آگهی‌های این فروشنده (مرتب‌شده از جدیدترین به قدیمی‌ترین)
    const myOrders = await Order.findAll({
      where: { sellerId: sellerId },
      order: [['createdAt', 'DESC']]
    });

    // اگر آگهی‌های کاربر دارای عکس (JSON string) هستند، بهتر است آن‌ها را به آرایه تبدیل کنیم
    const formattedOrders = myOrders.map(order => {
      const orderData = order.toJSON();
      if (orderData.images) {
        orderData.images = JSON.parse(orderData.images);
      }
      return orderData;
    });

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });

  } catch (error) {
    console.error('Get My Orders Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطا در دریافت لیست آگهی‌ها",
      errors: { server: ["مشکلی در ارتباط با دیتابیس پیش آمد."] }
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const sellerId = req.user.id; // از میدلور توکن می‌آید

    // ۱. پیدا کردن آگهی به شرطی که متعلق به همین فروشنده باشد
    const order = await Order.findOne({
      where: { 
        id: orderId, 
        sellerId: sellerId 
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "آگهی مورد نظر یافت نشد یا شما اجازه ویرایش آن را ندارید."
      });
    }

    // ۲. دریافت فیلدهایی که قرار است آپدیت شوند از بادی ریکوئست
    const { title, price, categoryId, saleType, description } = req.body;

    // ۳. اعمال تغییرات روی دیتابیس
    await order.update({
      title: title || order.title,
      price: price || order.price,
      categoryId: categoryId || order.categoryId,
      saleType: saleType || order.saleType,
      description: description || order.description
      // اگر آپلود عکس جدید هم داری، منطق تغییر نام/مسیر عکس را اینجا اضافه کن
    });

    return res.status(200).json({
      success: true,
      message: "آگهی با موفقیت ویرایش شد.",
      data: order
    });

  } catch (error) {
    console.error('Update Order Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطا در ویرایش آگهی",
      errors: { server: [error.message] }
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const sellerId = req.user.id; // شناسه کاربری که درخواست حذف داده است

    // ۱. پیدا کردن آگهی به شرطی که متعلق به این کاربر باشد
    const order = await Order.findOne({
      where: { 
        id: orderId, 
        sellerId: sellerId 
      }
    });

    // اگر آگهی پیدا نشد یا مال این کاربر نبود
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "آگهی مورد نظر یافت نشد یا شما اجازه حذف آن را ندارید."
      });
    }

    // ۲. حذف آگهی از دیتابیس
    await order.destroy();

    return res.status(200).json({
      success: true,
      message: "آگهی با موفقیت حذف شد."
    });

  } catch (error) {
    console.error('Delete Order Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطا در حذف آگهی",
      errors: { server: [error.message] }
    });
  }
};



exports.advancedSearch = async (req, res) => {
  try {
   
    const { 
      province, 
      search, 
      minPrice, 
      maxPrice, 
      saleType, 
      categoryId 
    } = req.query;

    let whereClause = {};

    
    if (province) {
      whereClause.province = province;
    }

    
    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`
      };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      
      if (minPrice) {
        whereClause.price[Op.gte] = minPrice; 
      }
      if (maxPrice) {
        whereClause.price[Op.lte] = maxPrice; 
      }
    }

    
    if (saleType) {
      whereClause.saleType = saleType;
    }

    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

   
    const orders = await Order.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']] 
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Advanced Search Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطا در جستجوی پیشرفته آگهی‌ها"
    });
  }
};

exports.updateHealthStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { healthStatus } = req.body; 

  
    const allowedStatuses = ['positive', 'negative', 'unknown'];
    if (!allowedStatuses.includes(healthStatus)) {
      return res.status(400).json({
        success: false,
        message: "مقدار ارسالی نامعتبر است. فقط positive, negative یا unknown مجاز است."
      });
    }

    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "آگهی مورد نظر یافت نشد."
      });
    }

    //
    order.healthStatus = healthStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "وضعیت سلامتی آگهی با موفقیت توسط ادمین بروزرسانی شد.",
      data: {
        id: order.id,
        healthStatus: order.healthStatus
      }
    });

  } catch (error) {
    console.error('Update Health Status Error:', error);
    return res.status(500).json({
      success: false,
      message: "خطا در بروزرسانی وضعیت سلامتی"
    });
  }
};