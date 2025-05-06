document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const price = document.querySelector('input[name="price"]').value;
  const description = document.querySelector('textarea[name="description"]').value;
  const category_id = document.querySelector("select[name='category']").value;
  const imageFile = document.getElementById("image").files[0];

  if (!imageFile) {
    alert("Vui lòng chọn ảnh sản phẩm.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("category_id", category_id);
  formData.append("image", imageFile);

  try {
    const token = localStorage.getItem("token"); // nếu bạn cần token để xác thực

    const res = await fetch("https://web-nongsan.onrender.com/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token || ""}`, // nếu có xác thực
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Thêm sản phẩm thành công!");
      location.reload();
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (err) {
    console.error("Lỗi fetch:", err);
    alert("Không thể kết nối đến server.");
  }
});
