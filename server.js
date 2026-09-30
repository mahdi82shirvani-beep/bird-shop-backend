const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./src/config/database');
const allRoutes = require('./src/modules/routes');


new (class Application {
  constructor() {
    this.setupDatabase();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrors();
    this.setupServer();
  }

  // ۱. راه‌اندازی سرور
  async setupServer() {
    const port = process.env.PORT || 3000;
    app.listen(port, (error) => {
      if (error) {
        console.error(`❌ Error running the application :\n${error}`);
      } else {
        console.log(`🚀 Application running on port ${port}.`);
      }
    });
  }

  async setupDatabase() {
    try {
      await sequelize.sync();
      console.log('✅ Database connected and synced successfully.');
    } catch (error) {
      console.error(`❌ Error connecting to database :\n${error.message}`);
    }
  }

  // ۳. تنظیم میدلورهای عمومی و امنیتی
  setupMiddlewares() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet()); 
    app.use(cors());

    console.log('✅ Setup all middlewares.');
  }

  // ۴. تنظیم روت‌های اصلی (مسیریاب مرکزی)
  setupRoutes() {
    app.use('/api', allRoutes);
    app.get('/', (req, res) => {
      res.json({ message: 'به وب‌سرویس فروشگاه پرنده خوش آمدید! 🦜' });
    });

    console.log('✅ Setup all routes.');
  }


  setupErrors() {
    app.use((req, res, next) => {
      res.status(404).json({ message: 'مسیر مورد نظر یافت نشد (404)' });
    });

 
    app.use((err, req, res, next) => {
      console.error(`❌ Express error: ${err.message}`);
      
      const status = err.status || 500;
      res.status(status).json({
        message: status === 500 ? 'خطای داخلی سرور رخ داده است' : err.message,
      });
    });

    process.on('uncaughtException', (error) => {
      console.error(`💥 Uncaught Exception: ${error.message}`);
      process.exit(1);
    });

    console.log('✅ Error handlers setup completed.');
  }
})();