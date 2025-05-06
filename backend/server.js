const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db'); // Kết nối MySQL
const path = require('path');


const app = express();
dotenv.config();

// Middleware chung
app.use(cors());
app.use(bodyParser.json());

// Serve static files từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));
// Serve static frontend files
app.use('/', express.static('frontend'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // nếu bạn có file ảnh tải lên

// API Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminProductRoutes = require('./routes/adminProducts');



app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminProductRoutes);

// Route kiểm tra server (tạm thời)
app.get('/', (req, res) => {
  res.send('Hello from nông sản API!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

// Route mọi request khác tới file index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'home.html'));
});



