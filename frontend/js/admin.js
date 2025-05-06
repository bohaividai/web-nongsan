document.addEventListener('DOMContentLoaded', async () => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          alert("Bạn chưa đăng nhập hoặc token đã hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login.html";
          return;
      }

      const response = await fetch('https://web-nongsan.onrender.com/api/products/pending', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách sản phẩm");
      }

      const products = await response.json();
      const adminProductList = document.getElementById('adminProductList');

      products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td>${product.seller_name || ''}</td>
              <td>
                  <button onclick="approveProduct(${product.id})">Duyệt</button>
                  <button onclick="deleteProduct(${product.id})">Xóa</button>
              </td>
          `;
          adminProductList.appendChild(row);
      });

  } catch (error) {
      console.error("Lỗi khi tải sản phẩm chờ duyệt:", error);
      alert("Lỗi khi tải sản phẩm chờ duyệt. Xem console để biết chi tiết.");
  }
});

  
async function approveProduct(productId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://web-nongsan.onrender.com/api/admin/products/${productId}/approve`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Không thể duyệt sản phẩm");
    }

    alert("Duyệt thành công!");
    location.reload();
  } catch (error) {
    alert("Không thể duyệt sản phẩm.");
    console.error(error);
  }
}


  
  async function deleteProduct(productId) {
    try {
      const response = await fetch(`https://web-nongsan.onrender.com/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi xóa sản phẩm');
      }
      alert('Xóa sản phẩm thành công!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Không thể xóa sản phẩm.');
    }
  }
  