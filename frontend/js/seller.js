document.getElementById('product-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const price = document.querySelector('input[name="price"]').value;
  const description = document.getElementById('description').value;
  const quantity = document.getElementById('quantity').value;
  const category_id = document.getElementById('category').value;
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) {
    return alert('⚠️ Vui lòng chọn ảnh!');
  }

  try {
    // 1. Upload ảnh lên server
    const formData = new FormData();
    formData.append('image', imageFile);

    const uploadRes = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      return alert('❌ Upload ảnh thất bại!');
    }

    const imageUrl = uploadData.imageUrl;

    // 2. Gửi dữ liệu sản phẩm
    const token = localStorage.getItem('token');

    const productRes = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name,
        price,
        description,
        quantity,
        category_id,
        image: imageUrl
      })
    });

    const productData = await productRes.json();

    if (productData.success) {
      alert('✅ Thêm sản phẩm thành công!');
      window.location.reload();
    } else {
      alert('❌ Thêm sản phẩm thất bại!');
    }

  } catch (err) {
    console.error(err);
    alert('❌ Lỗi máy chủ!');
  }
});
