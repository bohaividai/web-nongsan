document.getElementById('productForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const category_id = document.getElementById('category').value;
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) {
    alert("📷 사진을 업로드하세요!");
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    // 1. Upload ảnh lên Imgur
    const imgurRes = await fetch('/api/upload-imgur', {
      method: 'POST',
      body: formData
    });
    const imgurData = await imgurRes.json();

    if (!imgurData.imageUrl) {
      alert("❌ 이미지 업로드 실패!");
      return;
    }

    // 2. Gửi sản phẩm lên server
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price,
        description,
        image: imgurData.imageUrl,
        category_id,
        seller_id: localStorage.getItem('userId') || 1 // fallback nếu chưa đăng nhập
      })
    });

    const result = await response.json();
    if (response.ok) {
      alert("✅ 상품이 성공적으로 등록되었습니다!");
      window.location.reload();
    } else {
      alert("❌ 등록 실패: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ 서버 오류 발생!");
  }
});
