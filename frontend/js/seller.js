document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form); // lấy tất cả input từ form

  // Gửi kèm token nếu cần xác thực
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('https://web-nongsan.onrender.com/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` // nếu server cần xác thực
      },
      body: formData // quan trọng: gửi body là formData
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
