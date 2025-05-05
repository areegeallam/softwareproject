const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // استيراد مكتبة CORS
const productRoutes = require('./routes/products');  // استيراد مسارات الـ API الخاصة بالمنتجات

// تحميل المتغيرات البيئية من ملف .env
dotenv.config();

const app = express();

// تفعيل CORS لجميع المصادر (يمكنك تخصيصه إذا أردت)
app.use(cors());  // هذا يسمح لجميع الـ Origins بالوصول إلى API الخاص بك

// السماح للـ API بقراءة بيانات JSON من الـ body
app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB باستخدام الـ URI المخزن في ملف .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))  // إذا تم الاتصال بنجاح
  .catch(err => console.log('Error connecting to MongoDB:', err));  // إذا حدث خطأ في الاتصال

// ربط مسارات الـ API الخاصة بالمنتجات
app.use('/api/products', productRoutes);

// تشغيل الخادم على المنفذ المحدد في ملف .env
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
