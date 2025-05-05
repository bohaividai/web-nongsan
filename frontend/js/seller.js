document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user || user.role !== 'seller') {
    alert('Bạn không có quyền truy cập!');
    window.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const category_id = parseInt(document.getElementById('category').value);
    const seller_id = user.id;
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    
if (!imageFile) {
  alert('Vui lòng chọn ảnh sản phẩm!');
  return;
}

const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(imageFile.type)) {
  alert('Chỉ được chọn ảnh định dạng JPG hoặc PNG!');
  return;
}


    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category_id', category_id);
    formData.append('seller_id', seller_id);

    try {
      const response = await fetch('https://web-nongsan.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        window.location.href = 'home.html';
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Không thể kết nối tới máy chủ!');
    }
  });
});
