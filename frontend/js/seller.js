document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;
  const category = document.getElementById('category').value;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Bạn cần đăng nhập để đăng sản phẩm');
    return;
  }

  try {
    const response = await fetch('https://web-nongsan.onrender.com/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        price,
        image,
        category
        // Không cần gửi approved, server sẽ tự set = 0
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sản phẩm đã được gửi. Vui lòng chờ admin duyệt.');
      document.getElementById('productForm').reset();
    } else {
      alert(data.error || 'Có lỗi xảy ra khi đăng sản phẩm');
    }
  } catch (err) {
    console.error('Lỗi:', err);
    alert('Không thể kết nối đến máy chủ');
  }
});
