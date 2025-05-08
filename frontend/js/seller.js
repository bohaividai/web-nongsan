document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("input[name='name']").value;
  const price = document.querySelector("input[name='price']").value;
  const description = document.querySelector("textarea[name='description']").value;
  const image = document.querySelector("input[name='image']").files[0];
  const category = document.querySelector("select[name='category']").value;

  if (!image) {
    return alert("Vui lòng chọn ảnh sản phẩm!");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return alert("Bạn cần đăng nhập trước!");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("image", image);
  formData.append("category_id", category);

  try {
    const response = await fetch("https://web-nongsan.onrender.com/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Đã gửi sản phẩm, chờ admin duyệt.");
      document.getElementById("productForm").reset();
    } else {
      alert(data.message || "Có lỗi xảy ra khi đăng sản phẩm.");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lỗi kết nối server.");
  }
});
