document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const category_id = document.getElementById("category").value;

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
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      document.getElementById("productForm").reset();
    } else {
      alert(result.message || "Có lỗi khi đăng sản phẩm");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối server");
  }
});
