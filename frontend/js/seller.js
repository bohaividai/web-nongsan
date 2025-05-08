document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form); // Lấy dữ liệu form

  const token = localStorage.getItem('token'); // Token từ localStorage nếu cần xác thực

  try {
    const response = await fetch('https://web-nongsan.onrender.com/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` // Gửi token xác thực nếu cần
      },
      body: formData // Gửi formData để kèm file ảnh
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      form.reset();
    } else {
      alert('Có lỗi xảy ra khi đăng sản phẩm');
      console.error(result);
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    alert('Không thể kết nối đến máy chủ');
  }
});
