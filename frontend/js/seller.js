document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value.trim();
  const price = document.querySelector('input[name="price"]').value.trim();
  const description = document.querySelector('textarea[name="description"]').value.trim();
  const image = document.querySelector('input[type="file"]').files[0];
  const category_id = document.querySelector('select[name="category"]').value;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("image", image);
  formData.append("category_id", category_id);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://web-nongsan.onrender.com/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("🟢 Thêm sản phẩm thành công. Chờ admin duyệt!");
      document.getElementById("productForm").reset();
    } else {
      alert("❌ Thêm sản phẩm thất bại: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Lỗi kết nối máy chủ.");
  }
});
