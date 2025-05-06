const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// ✅ Kết nối MySQL
require('./db');

const app = express();
dotenv.config();

// Middleware chung
app.use(cors());
app.use(bodyParser.json());

// ✅ Static files từ frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Static uploads (ảnh)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminProductRoutes = require('./routes/adminProducts');

// ✅ Sử dụng API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminProductRoutes);

// ✅ Trả về file index.html cho các route không khớp
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ✅ Khởi động server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
