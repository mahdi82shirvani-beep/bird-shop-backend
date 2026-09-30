// src/modules/index.routes.js
const express = require('express');
const router = express.Router();


const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./users/user.routes');
const orderRoutes = require('./orders/order.routes');


router.use('/v1/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/v1/orders', orderRoutes);

module.exports = router;