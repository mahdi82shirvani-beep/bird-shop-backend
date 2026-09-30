const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const { verifyToken, isSeller , isAdmin } = require('../../middlewares/auth.middleware');
const { validateOrderFields, validateOrderFiles } = require('./order.validator');
const { createOrder , updateHealthStatus} = require('./order.controller');
const { getAllOrders , advancedSearch} = require('./order.controller');
const { getMyOrders } = require('./order.controller');
const { updateOrder } = require('./order.controller');
const { deleteOrder } = require('./order.controller');




// هندل کردن آپلود همزمان گواهی (۱ عدد) و تصاویر (حداکثر ۱۰ عدد)
const cpUpload = upload.fields([
  { name: 'health_certificate', maxCount: 1 }, 
  { name: 'images[]', maxCount: 10 }
]);

router.post('/create', verifyToken, isSeller ,cpUpload, validateOrderFiles , validateOrderFields, createOrder);
router.get('/getAllOrders' , getAllOrders);
router.get('/search', advancedSearch);
router.get('/getMyOrders', verifyToken ,getMyOrders );
router.patch('/updateOrder/:id', verifyToken, updateOrder);
router.patch('/health-status/:id', verifyToken, isAdmin, updateHealthStatus);
router.delete('/deleteOrder/:id', verifyToken, deleteOrder);


module.exports = router;