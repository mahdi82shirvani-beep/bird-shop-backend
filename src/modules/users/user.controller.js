const User = require('./user.model');
const SellerInfo = require('./seller-info.model'); // مسیر مدل اطلاعات فروشنده

exports.createUser = async (req, res) => {
  try {
    const { phone, role, fullName, nationalCode } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "شماره موبایل الزامی است." });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "این شماره موبایل قبلاً ثبت شده است." });
    }

    const newUser = await User.create({
      phone,
      role: role || 'buyer', 
      fullName
    });

    if (newUser.role === 'seller') {
      await SellerInfo.create({
        userId: newUser.id,
        fullName: fullName || 'بدون نام',
        nationalCode: nationalCode || null
      });
    }

    return res.status(201).json({
      success: true,
      message: `کاربر با نقش ${newUser.role} با موفقیت ساخته شد.`,
      data: newUser
    });

  } catch (error) {
    console.error('Create User Error:', error);
    return res.status(500).json({ success: false, message: "خطا در ساخت کاربر" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { phone, role, fullName } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "کاربر یافت نشد." });
    }

    if (role === 'seller' && user.role !== 'seller') {
      const existingInfo = await SellerInfo.findOne({ where: { userId: user.id } });
      if (!existingInfo) {
        await SellerInfo.create({ userId: user.id, fullName: fullName || user.fullName });
      }
    }

    await user.update({
      phone: phone || user.phone,
      role: role || user.role,
      fullName: fullName || user.fullName
    });

    return res.status(200).json({
      success: true,
      message: "اطلاعات کاربر با موفقیت ویرایش شد.",
      data: user
    });

  } catch (error) {
    console.error('Edit User Error:', error);
    return res.status(500).json({ success: false, message: "خطا در ویرایش کاربر" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "کاربر یافت نشد." });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "کاربر و تمامی اطلاعات وابسته به او با موفقیت حذف شدند."
    });

  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ success: false, message: "خطا در حذف کاربر" });
  }
};